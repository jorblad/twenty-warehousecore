import {
  defineField,
  FieldType,
  RelationType,
  OnDeleteAction,
} from 'twenty-sdk/define';

import {
  JOB_PRODUCT_REQUIREMENT_UNIVERSAL_IDENTIFIER,
  PRODUCT_ON_REQUIREMENT_FIELD_ID,
} from '../objects/job-product-requirement.object';
import {
  WH_PRODUCT_UNIVERSAL_IDENTIFIER,
  JOB_REQS_ON_WH_PRODUCT_FIELD_ID,
} from '../objects/warehouse-product.object';

// MANY_TO_ONE: JobProductRequirement → WarehouseCoreProduct
export default defineField({
  universalIdentifier: PRODUCT_ON_REQUIREMENT_FIELD_ID,
  objectUniversalIdentifier: JOB_PRODUCT_REQUIREMENT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'warehouseProduct',
  label: 'Product',
  description: 'The WarehouseCore product for this requirement',
  icon: 'IconBox',
  isNullable: true,
  onDelete: OnDeleteAction.SET_NULL,
  relationTargetObjectMetadataUniversalIdentifier: WH_PRODUCT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: JOB_REQS_ON_WH_PRODUCT_FIELD_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    joinColumnName: 'warehouseProductId',
  },
});
