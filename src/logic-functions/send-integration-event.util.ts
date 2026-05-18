type DatabaseEventPayload = {
  recordId?: string;
  properties?: {
    after?: Record<string, unknown>;
    before?: Record<string, unknown>;
  };
};

type GraphqlResult = {
  data?: Record<string, any>;
  errors?: Array<{ message?: string }>;
};

type SendResult = {
  sent: boolean;
  reason?: string;
  responseStatus?: number;
};

type EventAction = 'upsert' | 'delete';
type EventEntityType = 'customer' | 'job' | 'requirement';

type RequirementRecord = {
  id: string;
  quantity?: number | null;
  warehouseCoreProductId?: number | null;
  opportunity?: {
    id?: string | null;
    warehouseCoreJobId?: number | null;
  } | null;
};

type OpportunityRecord = {
  id: string;
  name?: string | null;
  jobCode?: string | null;
  warehouseCoreJobId?: number | null;
  jobStartDate?: string | null;
  jobEndDate?: string | null;
  company?: {
    id?: string | null;
    name?: string | null;
  } | null;
};

type CompanyRecord = {
  id: string;
  name?: string | null;
};

type PersonRecord = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  emails?: {
    primaryEmail?: string | null;
  } | null;
  phone?: string | null;
  company?: {
    id?: string | null;
    name?: string | null;
  } | null;
};

const graphqlEndpoint = `${process.env.TWENTY_API_URL ?? 'http://localhost:2020'}/graphql`;
const warehouseBaseUrl = (process.env.WAREHOUSECORE_BASE_URL ?? 'http://localhost:8081').replace(/\/$/, '');
const warehouseEventEndpoint = `${warehouseBaseUrl}/api/v1/integrations/twenty/events`;

const getTwentyAuthToken = (): string | null => {
  return process.env.TWENTY_APP_ACCESS_TOKEN ?? process.env.TWENTY_API_KEY ?? null;
};

const getWarehouseApiKey = (): string | null => {
  return process.env.WAREHOUSECORE_API_KEY ?? process.env.SERVICE_API_KEY ?? null;
};

const runGraphql = async (
  query: string,
  variables: Record<string, unknown>,
): Promise<GraphqlResult> => {
  const token = getTwentyAuthToken();
  const response = await fetch(graphqlEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });

  return response.json();
};

const tryGraphqlOperations = async <T>(
  operations: Array<{ query: string; pick: (data: Record<string, any>) => T | null | undefined }>,
  variables: Record<string, unknown>,
): Promise<T | null> => {
  for (const operation of operations) {
    try {
      const result = await runGraphql(operation.query, variables);
      if (result.errors?.length) {
        continue;
      }
      const picked = operation.pick(result.data ?? {});
      if (picked) {
        return picked;
      }
    } catch {
      continue;
    }
  }
  return null;
};

const asString = (raw: unknown): string => {
  if (raw === null || raw === undefined) {
    return '';
  }
  if (typeof raw === 'string') {
    return raw.trim();
  }
  if (typeof raw === 'number' || typeof raw === 'boolean') {
    return String(raw);
  }
  return '';
};

const asNumber = (raw: unknown): number | null => {
  if (raw === null || raw === undefined) {
    return null;
  }
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return raw;
  }
  if (typeof raw === 'string' && raw.trim() !== '') {
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const buildIdempotencyKey = (
  entityType: EventEntityType,
  action: EventAction,
  externalId: string,
  fallbackSeed: string,
): string => {
  return [
    'twenty',
    entityType,
    action,
    externalId || 'unknown',
    fallbackSeed || Date.now().toString(),
  ].join(':');
};

const sendIntegrationEvent = async (
  payload: Record<string, unknown>,
): Promise<SendResult> => {
  const apiKey = getWarehouseApiKey();
  try {
    const response = await fetch(warehouseEventEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'X-API-Key': apiKey } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return { sent: false, reason: `warehouse_response_${response.status}`, responseStatus: response.status };
    }

    return { sent: true, responseStatus: response.status };
  } catch {
    return { sent: false, reason: 'warehouse_unreachable' };
  }
};

const getCompanyRecord = async (companyId: string): Promise<CompanyRecord | null> => {
  const operations = [
    {
      query: `query GetCompany($id: UUID!) { company(id: $id) { id name } }`,
      pick: (data: Record<string, any>) => data.company as CompanyRecord | null,
    },
    {
      query: `query GetCompany($id: ID!) { company(id: $id) { id name } }`,
      pick: (data: Record<string, any>) => data.company as CompanyRecord | null,
    },
  ];

  return tryGraphqlOperations(operations, { id: companyId });
};

const getOpportunityRecord = async (opportunityId: string): Promise<OpportunityRecord | null> => {
  const operations = [
    {
      query: `query GetOpportunity($id: UUID!) {
        opportunity(id: $id) {
          id
          name
          jobCode
          warehouseCoreJobId
          jobStartDate
          jobEndDate
          company { id name }
        }
      }`,
      pick: (data: Record<string, any>) => data.opportunity as OpportunityRecord | null,
    },
    {
      query: `query GetOpportunity($id: ID!) {
        opportunity(id: $id) {
          id
          name
          jobCode
          warehouseCoreJobId
          jobStartDate
          jobEndDate
          company { id name }
        }
      }`,
      pick: (data: Record<string, any>) => data.opportunity as OpportunityRecord | null,
    },
  ];

  return tryGraphqlOperations(operations, { id: opportunityId });
};

const getPersonRecord = async (personId: string): Promise<PersonRecord | null> => {
  const operations = [
    {
      query: `query GetPerson($id: UUID!) {
        person(id: $id) {
          id
          firstName
          lastName
          emails { primaryEmail }
          phone
          company { id name }
        }
      }`,
      pick: (data: Record<string, any>) => data.person as PersonRecord | null,
    },
    {
      query: `query GetPerson($id: ID!) {
        person(id: $id) {
          id
          firstName
          lastName
          emails { primaryEmail }
          phone
          company { id name }
        }
      }`,
      pick: (data: Record<string, any>) => data.person as PersonRecord | null,
    },
  ];

  return tryGraphqlOperations(operations, { id: personId });
};

const getRequirementRecord = async (requirementId: string): Promise<RequirementRecord | null> => {
  const operations = [
    {
      query: `query GetRequirement($id: UUID!) {
        opportunityRequirementLine(id: $id) {
          id
          quantity
          warehouseCoreProductId
          opportunity { id warehouseCoreJobId }
        }
      }`,
      pick: (data: Record<string, any>) => data.opportunityRequirementLine as RequirementRecord | null,
    },
    {
      query: `query GetRequirement($id: ID!) {
        opportunityRequirementLine(id: $id) {
          id
          quantity
          warehouseCoreProductId
          opportunity { id warehouseCoreJobId }
        }
      }`,
      pick: (data: Record<string, any>) => data.opportunityRequirementLine as RequirementRecord | null,
    },
  ];

  return tryGraphqlOperations(operations, { id: requirementId });
};

export const emitCompanyEvent = async (
  event: DatabaseEventPayload,
  action: EventAction,
): Promise<SendResult> => {
  const recordId = asString(event.recordId);
  if (!recordId) {
    return { sent: false, reason: 'missing_record_id' };
  }

  const snapshot = event.properties?.after ?? event.properties?.before ?? {};
  const company = action === 'delete' ? null : await getCompanyRecord(recordId);
  const externalId = company?.id ?? recordId;
  const name = company?.name ?? asString(snapshot['name']);
  const warehouseId = asNumber(snapshot['warehouseCoreCustomerId']);
  const fallbackSeed = asString(snapshot['updatedAt']) || asString(snapshot['name']) || recordId;

  const payload = {
    eventId: `twenty-customer-${action}-${externalId}-${Date.now()}`,
    schemaVersion: 1,
    source: 'twenty',
    entityType: 'customer',
    action,
    occurredAt: new Date().toISOString(),
    correlationId: `twenty-customer-${externalId}`,
    idempotencyKey: buildIdempotencyKey('customer', action, externalId, fallbackSeed),
    entity: {
      externalId,
      warehouseId,
      fields: {
        name,
      },
    },
  };

  return sendIntegrationEvent(payload);
};

export const emitOpportunityEvent = async (
  event: DatabaseEventPayload,
  action: EventAction,
): Promise<SendResult> => {
  const recordId = asString(event.recordId);
  if (!recordId) {
    return { sent: false, reason: 'missing_record_id' };
  }

  const snapshot = event.properties?.after ?? event.properties?.before ?? {};
  const opportunity = action === 'delete' ? null : await getOpportunityRecord(recordId);
  const externalId = opportunity?.id ?? recordId;
  const warehouseId = asNumber(opportunity?.warehouseCoreJobId ?? snapshot['warehouseCoreJobId']);
  const fallbackSeed = asString(snapshot['updatedAt']) || asString(opportunity?.jobCode) || recordId;

  const payload = {
    eventId: `twenty-job-${action}-${externalId}-${Date.now()}`,
    schemaVersion: 1,
    source: 'twenty',
    entityType: 'job',
    action,
    occurredAt: new Date().toISOString(),
    correlationId: `twenty-job-${externalId}`,
    idempotencyKey: buildIdempotencyKey('job', action, externalId, fallbackSeed),
    entity: {
      externalId,
      warehouseId,
      fields: {
        name: opportunity?.name ?? asString(snapshot['name']),
        jobCode: opportunity?.jobCode ?? asString(snapshot['jobCode']),
        jobStartDate: opportunity?.jobStartDate ?? asString(snapshot['jobStartDate']),
        jobEndDate: opportunity?.jobEndDate ?? asString(snapshot['jobEndDate']),
        customerExternalId: opportunity?.company?.id ?? asString((snapshot['company'] as { id?: string } | undefined)?.id),
        customerName: opportunity?.company?.name ?? asString((snapshot['company'] as { name?: string } | undefined)?.name),
      },
    },
  };

  return sendIntegrationEvent(payload);
};

export const emitPersonEvent = async (
  event: DatabaseEventPayload,
  action: EventAction,
): Promise<SendResult> => {
  const recordId = asString(event.recordId);
  if (!recordId) {
    return { sent: false, reason: 'missing_record_id' };
  }

  const snapshot = event.properties?.after ?? event.properties?.before ?? {};
  const person = action === 'delete' ? null : await getPersonRecord(recordId);
  const externalId = person?.id ?? recordId;
  const firstName = person?.firstName ?? asString(snapshot['firstName']);
  const lastName = person?.lastName ?? asString(snapshot['lastName']);
  const fullName = [firstName, lastName].filter((part) => part && part.trim() !== '').join(' ').trim();
  const fallbackName = fullName || asString(snapshot['name']);
  const email = asString(person?.emails?.primaryEmail ?? snapshot['email']);
  const phone = asString(person?.phone ?? snapshot['phone']);
  const fallbackSeed = asString(snapshot['updatedAt']) || fallbackName || recordId;

  const payload = {
    eventId: `twenty-person-${action}-${externalId}-${Date.now()}`,
    schemaVersion: 1,
    source: 'twenty',
    entityType: 'customer',
    action,
    occurredAt: new Date().toISOString(),
    correlationId: `twenty-person-${externalId}`,
    idempotencyKey: buildIdempotencyKey('customer', action, externalId, fallbackSeed),
    entity: {
      externalId,
      warehouseId: asNumber(snapshot['warehouseCoreCustomerId']),
      fields: {
        name: fallbackName,
        firstName,
        lastName,
        email,
        phone,
        companyExternalId: person?.company?.id ?? asString((snapshot['company'] as { id?: string } | undefined)?.id),
        companyName: person?.company?.name ?? asString((snapshot['company'] as { name?: string } | undefined)?.name),
      },
    },
  };

  return sendIntegrationEvent(payload);
};

export const emitRequirementEvent = async (
  event: DatabaseEventPayload,
  action: EventAction,
): Promise<SendResult> => {
  const recordId = asString(event.recordId);
  if (!recordId) {
    return { sent: false, reason: 'missing_record_id' };
  }

  const snapshot = event.properties?.after ?? event.properties?.before ?? {};
  const req = action === 'delete' ? null : await getRequirementRecord(recordId);
  const externalId = req?.id ?? recordId;
  const jobExternalId = req?.opportunity?.id ?? asString((snapshot['opportunity'] as { id?: string } | undefined)?.id) ?? asString(snapshot['opportunityId']);
  const jobWarehouseId = asNumber(req?.opportunity?.warehouseCoreJobId ?? snapshot['warehouseCoreJobId']);
  const warehouseProductId = asNumber(req?.warehouseCoreProductId ?? snapshot['warehouseCoreProductId']);
  const quantity = asNumber(req?.quantity ?? snapshot['quantity']) ?? 1;
  const fallbackSeed = asString(snapshot['updatedAt']) || String(quantity) || recordId;

  const payload = {
    eventId: `twenty-requirement-${action}-${externalId}-${Date.now()}`,
    schemaVersion: 1,
    source: 'twenty',
    entityType: 'requirement',
    action,
    occurredAt: new Date().toISOString(),
    correlationId: `twenty-requirement-${externalId}`,
    idempotencyKey: buildIdempotencyKey('requirement', action, externalId, fallbackSeed),
    entity: {
      externalId,
      warehouseId: jobWarehouseId,
      fields: {
        jobExternalId,
        jobWarehouseId,
        warehouseProductId,
        quantity,
      },
    },
  };

  return sendIntegrationEvent(payload);
};
