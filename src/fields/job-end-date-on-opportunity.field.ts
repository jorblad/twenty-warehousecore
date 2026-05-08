import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

export const JOB_END_DATE_ON_OPPORTUNITY_FIELD_ID =
  'f1f2f3f4-f5f6-4789-8fff-890123456789';

export default defineField({
  universalIdentifier: JOB_END_DATE_ON_OPPORTUNITY_FIELD_ID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.DATE,
  name: 'jobEndDate',
  label: 'Job End Date',
  description: 'Date the job / event ends',
  icon: 'IconCalendarOff',
  isNullable: true,
});
