import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

export const WAREHOUSE_JOB_ID_ON_OPPORTUNITY_FIELD_ID =
  'c1c2c3c4-c5c6-4789-8ccc-567890123456';

export default defineField({
  universalIdentifier: WAREHOUSE_JOB_ID_ON_OPPORTUNITY_FIELD_ID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.NUMBER,
  name: 'warehouseCoreJobId',
  label: 'WarehouseCore Job ID',
  description:
    'Numeric job ID in WarehouseCore — used to link this opportunity to WarehouseCore scan data',
  icon: 'IconDatabase',
  isNullable: true,
});
