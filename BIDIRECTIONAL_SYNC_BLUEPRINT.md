# Bidirectional Sync Blueprint (Twenty <-> WarehouseCore)

## 1. Scope
This blueprint defines a safe bidirectional sync for:
- Customers/companies
- Jobs/opportunities
- Job requirement lines
- Warehouse products and stock

Goals:
- Keep both systems consistent without update loops
- Preserve one clear source of truth per field
- Support retries and replay safely

Non-goals for phase 1:
- Full historical event sourcing
- Multi-master conflict editing for the same owned field

## 2. Canonical IDs and Link Strategy
Use stable cross-system links, never name-based matching.

Recommended link storage:
- WarehouseCore table `integration_links`
- Twenty object fields where useful (`warehouseCoreJobId`, `warehouseCoreCustomerId`, `warehouseCoreProductId`)

Suggested `integration_links` shape:
- `system` (`twenty`)
- `entity_type` (`customer`, `job`, `requirement`, `product`)
- `warehouse_id` (string/int as text)
- `twenty_id` (uuid/text)
- `last_source` (`warehousecore` or `twenty`)
- `last_event_id` (for idempotency)
- `last_synced_at`
- unique indexes on (`system`, `entity_type`, `warehouse_id`) and (`system`, `entity_type`, `twenty_id`)

## 3. Ownership Matrix (Field-Level)
Owner means system of truth for that field. Non-owner updates are ignored or mapped to owner-owned derived fields.

| Entity | Field Group | Owner | Sync Direction |
|---|---|---|---|
| Customer | External ID mapping | Shared via `integration_links` | Two-way |
| Customer | Name, billing address, VAT/org number | Twenty | Twenty -> WarehouseCore |
| Customer | Warehouse operational notes (pickup constraints, loading dock hints) | WarehouseCore | WarehouseCore -> Twenty |
| Customer | CRM stage, lead metadata, sales owner | Twenty | Twenty -> WarehouseCore (optional subset) |
| Job/Opportunity | External ID mapping | Shared via `integration_links` | Two-way |
| Job/Opportunity | Job title/code | Twenty (code may be generated in WarehouseCore once, then locked) | Twenty -> WarehouseCore |
| Job/Opportunity | Start/end dates | Twenty | Twenty -> WarehouseCore |
| Job/Opportunity | Operational fulfillment status (packed, checked out, returned) | WarehouseCore | WarehouseCore -> Twenty |
| Job/Opportunity | Commercial stage/probability | Twenty | Twenty authoritative |
| Requirement line | Product link and quantity | Twenty (planning) | Twenty -> WarehouseCore |
| Requirement line | Unit price defaults from product | WarehouseCore product catalog | WarehouseCore -> Twenty default; Twenty can override agreed values |
| Requirement line | Calculated line totals | Derived in both from quantity x price | Two-way derived |
| Product | Product identity, category, base daily rate | WarehouseCore | WarehouseCore -> Twenty |
| Product | Stock/availability counters | WarehouseCore | WarehouseCore -> Twenty |

## 4. Conflict Policy
Apply strict owner-wins rules.

Rules:
1. If an event updates an owner field from the owner system, accept.
2. If an event updates an owner field from non-owner system, reject with reason `non_owner_field_update` and log.
3. Derived fields are recomputed, not manually merged.
4. If two owner events race, accept newest by `occurredAt`; keep prior as audit log.
5. Never re-emit an event if only integration metadata changed.

## 5. Event Contract (Minimum Viable)
Use one envelope for all entities.

```json
{
  "eventId": "uuid",
  "schemaVersion": 1,
  "source": "twenty",
  "entityType": "job",
  "action": "upsert",
  "occurredAt": "2026-05-11T12:00:00Z",
  "correlationId": "uuid",
  "idempotencyKey": "sha256(source+entityType+entityId+version)",
  "entity": {
    "externalId": "twenty-record-id",
    "warehouseId": "optional-local-id",
    "version": 14,
    "fields": {}
  }
}
```

Required behavior:
- Consumers persist `eventId` and `idempotencyKey`
- Duplicate keys must return success with `status=duplicate_ignored`
- Unknown fields are ignored, not fatal

### 5.1 Customer Upsert Payload
```json
{
  "entityType": "customer",
  "action": "upsert",
  "entity": {
    "externalId": "twenty-company-id",
    "fields": {
      "name": "ACME GmbH",
      "billingAddress": "...",
      "vatNumber": "...",
      "phone": "...",
      "email": "..."
    }
  }
}
```

### 5.2 Job Upsert Payload
```json
{
  "entityType": "job",
  "action": "upsert",
  "entity": {
    "externalId": "twenty-opportunity-id",
    "warehouseId": 1234,
    "fields": {
      "name": "Summer Festival",
      "jobCode": "JOB-2026-0042",
      "startDate": "2026-06-10",
      "endDate": "2026-06-13",
      "customerExternalId": "twenty-company-id"
    }
  }
}
```

### 5.3 Requirement Upsert/Delete Payload
```json
{
  "entityType": "requirement",
  "action": "upsert",
  "entity": {
    "externalId": "twenty-requirement-id",
    "fields": {
      "jobExternalId": "twenty-opportunity-id",
      "warehouseProductId": 987,
      "quantity": 24,
      "unitPrice": 45.0,
      "lineTotal": 1080.0
    }
  }
}
```

## 6. Transport and Security
Minimum requirements:
- HTTPS only
- HMAC signature header, for example `X-Integration-Signature: sha256=...`
- Timestamp header and 5-minute skew window
- Secret rotation with dual-secret verification window

Recommended headers:
- `X-Event-Id`
- `X-Correlation-Id`
- `X-Schema-Version`

## 7. Loop Prevention
Use these safeguards together:
1. `source` field in every event (`twenty` or `warehousecore`)
2. `last_source` on link record
3. Ignore events that only mirror the last applied source/version
4. Per-entity debounce window (for burst edits)

## 8. Minimal API Surface
WarehouseCore should expose:
- `POST /api/v1/integrations/twenty/events` (ingest customer/job/requirement events)
- `GET /api/v1/integrations/twenty/events/:eventId` (diagnostics)
- `POST /api/v1/twenty/sync-products` (already exists, keep for product sync)
- `POST /api/v1/integrations/twenty/replay` (admin replay by time range)

Twenty app side should provide:
- Logic function triggers for create/update/delete on customer/opportunity/requirement
- Outbound sender to WarehouseCore with retries

## 9. Retry, Dead Letter, and Replay
Retry policy:
- Exponential backoff, max 10 attempts
- Retry only transient failures (timeouts, 429, 5xx)

Dead letter queue:
- Store payload, error, and next manual action
- Admin endpoint/UI to replay dead letters

Replay:
- Time-range replay with idempotency still enforced

## 10. Rollout Plan
Phase 1:
- Implement `integration_links`
- Implement inbound event endpoint in WarehouseCore
- Add outbound events from Twenty for customer/job/requirement updates

Phase 2:
- Enable owner-wins conflict checks
- Add dead-letter queue and replay endpoint

Phase 3:
- Add monitoring dashboards and alerting
- Add contract tests and backfill tools

## 11. Acceptance Criteria
1. Updating customer name in Twenty updates WarehouseCore exactly once.
2. Updating warehouse fulfillment status in WarehouseCore updates Twenty exactly once.
3. Replayed duplicate event does not create duplicate records.
4. Non-owner field change is rejected with explicit reason.
5. Product and stock sync remains WarehouseCore -> Twenty authoritative.

## 12. Notes for Current Codebase
This blueprint matches current implementation direction:
- Product sync already runs WarehouseCore -> Twenty (`/api/v1/twenty/sync-products`)
- Opportunity/job mapping already exists in adapter handlers
- Requirement lines are already represented in Twenty app and WarehouseCore handlers

Next implementation step: add event ingestion endpoint plus link table first, then enable Twenty outbound events for customer/job/requirement mutations.
