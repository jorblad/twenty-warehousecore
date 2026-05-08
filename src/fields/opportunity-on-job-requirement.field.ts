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
import { JOB_REQUIREMENTS_ON_OPPORTUNITY_FIELD_ID } from './job-requirements-on-opportunity.field';

export default defineField({
  universalIdentifier: OPPORTUNITY_ON_REQUIREMENT_FIELD_ID,
  objectUniversalIdentifier:
    JOB_PRODUCT_REQUIREMENT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'opportunity',
  label: 'Job',
  description: 'The job (opportunity) this requirement belongs to',
  icon: 'IconBriefcase',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier:
    JOB_REQUIREMENTS_ON_OPPORTUNITY_FIELD_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.CASCADE,
    joinColumnName: 'opportunityId',
  },
});
