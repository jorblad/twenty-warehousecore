import { defineField, FieldType, RelationType } from 'twenty-sdk/define';

import {
  WH_PRODUCT_UNIVERSAL_IDENTIFIER,
  JOB_REQS_ON_WH_PRODUCT_FIELD_ID,
} from '../objects/warehouse-product.object';
import {
  JOB_PRODUCT_REQUIREMENT_UNIVERSAL_IDENTIFIER,
  PRODUCT_ON_REQUIREMENT_FIELD_ID,
} from '../objects/job-product-requirement.object';

// ONE_TO_MANY: WarehouseCoreProduct → [JobProductRequirement]
export default defineField({
  universalIdentifier: JOB_REQS_ON_WH_PRODUCT_FIELD_ID,
  objectUniversalIdentifier: WH_PRODUCT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'jobProductRequirements',
  label: 'Used In Jobs',
  description: 'Job requirements referencing this product',
  icon: 'IconPackage',
  relationTargetObjectMetadataUniversalIdentifier:
    JOB_PRODUCT_REQUIREMENT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: PRODUCT_ON_REQUIREMENT_FIELD_ID,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
