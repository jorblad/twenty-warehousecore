import {
  defineField,
  FieldType,
  RelationType,
  OnDeleteAction,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  JOB_PRODUCT_REQUIREMENT_UNIVERSAL_IDENTIFIER,
  OPPORTUNITY_ON_REQUIREMENT_FIELD_ID,
} from '../objects/job-product-requirement.object';

// ONE_TO_MANY reverse field ID — imported by the object file
export const JOB_REQUIREMENTS_ON_OPPORTUNITY_FIELD_ID =
  'b1c2d3e4-f5a6-4789-8bcd-456789012345';

export default defineField({
  universalIdentifier: JOB_REQUIREMENTS_ON_OPPORTUNITY_FIELD_ID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.RELATION,
  name: 'jobProductRequirements',
  label: 'Product Requirements',
  description: 'Products required for this job',
  icon: 'IconPackage',
  relationTargetObjectMetadataUniversalIdentifier:
    JOB_PRODUCT_REQUIREMENT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    OPPORTUNITY_ON_REQUIREMENT_FIELD_ID,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
