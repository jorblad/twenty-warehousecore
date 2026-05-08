import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

export const JOB_CODE_ON_OPPORTUNITY_FIELD_ID =
  'd1d2d3d4-d5d6-4789-8ddd-678901234567';

export default defineField({
  universalIdentifier: JOB_CODE_ON_OPPORTUNITY_FIELD_ID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.TEXT,
  name: 'jobCode',
  label: 'Job Code',
  description: 'Human-readable job reference code (e.g. JOB000042)',
  icon: 'IconTag',
  isNullable: true,
});
