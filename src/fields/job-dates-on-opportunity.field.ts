import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

export const JOB_START_DATE_ON_OPPORTUNITY_FIELD_ID =
  'e1e2e3e4-e5e6-4789-8eee-789012345678';

export default defineField({
  universalIdentifier: JOB_START_DATE_ON_OPPORTUNITY_FIELD_ID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.DATE,
  name: 'jobStartDate',
  label: 'Job Start Date',
  description: 'Date the job / event begins',
  icon: 'IconCalendarEvent',
  isNullable: true,
});
