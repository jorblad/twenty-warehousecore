import { defineObject, FieldType } from 'twenty-sdk/define';

export const JOB_PRODUCT_REQUIREMENT_UNIVERSAL_IDENTIFIER =
  'c1d2e3f4-a5b6-4789-8cde-f01234567890';

export const REQUIREMENT_NAME_FIELD_ID =
  'd1e2f3a4-b5c6-4789-8def-012345678901';

export const REQUIREMENT_QUANTITY_FIELD_ID =
  'e1f2a3b4-c5d6-4789-8efa-123456789012';

export const REQUIREMENT_WH_PRODUCT_ID_FIELD_ID =
  'f1a2b3c4-d5e6-4789-8fab-234567890123';

// MANY_TO_ONE relation field ID (defined separately in opportunity-on-job-requirement.field.ts)
export const OPPORTUNITY_ON_REQUIREMENT_FIELD_ID =
  'a1b2c3d4-e5f6-4789-8abc-345678901234';

// MANY_TO_ONE relation field ID for WarehouseCoreProduct link (defined in product-on-job-requirement.field.ts)
export const PRODUCT_ON_REQUIREMENT_FIELD_ID =
  'a3b4c5d6-e7f8-4902-9abc-345678901234';

export default defineObject({
  universalIdentifier: JOB_PRODUCT_REQUIREMENT_UNIVERSAL_IDENTIFIER,
  nameSingular: 'jobProductRequirement',
  namePlural: 'jobProductRequirements',
  labelSingular: 'Job Product Requirement',
  labelPlural: 'Job Product Requirements',
  description: 'A product line required for a job (opportunity)',
  icon: 'IconPackage',
  labelIdentifierFieldMetadataUniversalIdentifier: REQUIREMENT_NAME_FIELD_ID,
  fields: [
    {
      universalIdentifier: REQUIREMENT_NAME_FIELD_ID,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Product Name',
      description: 'Name of the required product',
      icon: 'IconAbc',
    },
    {
      universalIdentifier: REQUIREMENT_QUANTITY_FIELD_ID,
      type: FieldType.NUMBER,
      name: 'quantity',
      label: 'Quantity',
      description: 'Number of units required',
      icon: 'IconHash',
    },
    {
      universalIdentifier: REQUIREMENT_WH_PRODUCT_ID_FIELD_ID,
      type: FieldType.NUMBER,
      name: 'warehouseCoreProductId',
      label: 'WarehouseCore Product ID',
      description: 'Numeric product ID in WarehouseCore',
      icon: 'IconDatabase',
    },
  ],
});
