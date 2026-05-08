import { defineObject, FieldType } from 'twenty-sdk/define';

export const WH_PRODUCT_UNIVERSAL_IDENTIFIER =
  'a2b3c4d5-e6f7-4891-9abc-def012345678';

export const WH_PRODUCT_WAREHOUSE_ID_FIELD_ID =
  'b2c3d4e5-f6a7-4891-9bcd-ef0123456789';

export const WH_PRODUCT_NAME_FIELD_ID =
  'c2d3e4f5-a6b7-4891-9cde-f01234567890';

export const WH_PRODUCT_CATEGORY_FIELD_ID =
  'd2e3f4a5-b6c7-4891-9def-012345678901';

export const WH_PRODUCT_LAST_SYNC_FIELD_ID =
  'e2f3a4b5-c6d7-4891-9efa-123456789012';

// ONE_TO_MANY reverse relation field ID (defined in job-requirements-on-wh-product.field.ts)
export const JOB_REQS_ON_WH_PRODUCT_FIELD_ID =
  'f2a3b4c5-d6e7-4891-9fab-234567890123';

export default defineObject({
  universalIdentifier: WH_PRODUCT_UNIVERSAL_IDENTIFIER,
  nameSingular: 'warehouseCoreProduct',
  namePlural: 'warehouseCoreProducts',
  labelSingular: 'WarehouseCore Product',
  labelPlural: 'WarehouseCore Products',
  description: 'A product synced from WarehouseCore inventory',
  icon: 'IconBox',
  labelIdentifierFieldMetadataUniversalIdentifier: WH_PRODUCT_NAME_FIELD_ID,
  fields: [
    {
      universalIdentifier: WH_PRODUCT_WAREHOUSE_ID_FIELD_ID,
      type: FieldType.NUMBER,
      name: 'warehouseId',
      label: 'WarehouseCore ID',
      description: 'Numeric product ID in WarehouseCore',
      icon: 'IconDatabase',
    },
    {
      universalIdentifier: WH_PRODUCT_NAME_FIELD_ID,
      type: FieldType.TEXT,
      name: 'productName',
      label: 'Product Name',
      description: 'Name of the product in WarehouseCore',
      icon: 'IconAbc',
    },
    {
      universalIdentifier: WH_PRODUCT_CATEGORY_FIELD_ID,
      type: FieldType.TEXT,
      name: 'categoryName',
      label: 'Category',
      description: 'Product category from WarehouseCore',
      icon: 'IconTag',
    },
    {
      universalIdentifier: WH_PRODUCT_LAST_SYNC_FIELD_ID,
      type: FieldType.DATE_TIME,
      name: 'lastSyncAt',
      label: 'Last Synced',
      description: 'When this product was last synced from WarehouseCore',
      icon: 'IconClock',
      isNullable: true,
    },
  ],
});
