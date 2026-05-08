import { defineView, ViewKey } from 'twenty-sdk/define';

import {
  JOB_PRODUCT_REQUIREMENT_UNIVERSAL_IDENTIFIER,
  REQUIREMENT_NAME_FIELD_ID,
  REQUIREMENT_QUANTITY_FIELD_ID,
  REQUIREMENT_WH_PRODUCT_ID_FIELD_ID,
  OPPORTUNITY_ON_REQUIREMENT_FIELD_ID,
} from '../objects/job-product-requirement.object';

export const JOB_REQUIREMENTS_VIEW_ID =
  'a1a2a3a4-a5a6-4789-8aaa-901234567890';

export default defineView({
  universalIdentifier: JOB_REQUIREMENTS_VIEW_ID,
  name: 'All Job Requirements',
  objectUniversalIdentifier: JOB_PRODUCT_REQUIREMENT_UNIVERSAL_IDENTIFIER,
  icon: 'IconPackage',
  key: ViewKey.INDEX,
  position: 0,
  fields: [
    {
      universalIdentifier: 'f0a0b0c0-d0e0-4f00-8a00-000000000001',
      fieldMetadataUniversalIdentifier: REQUIREMENT_NAME_FIELD_ID,
      position: 0,
      isVisible: true,
      size: 240,
    },
    {
      universalIdentifier: 'f0a0b0c0-d0e0-4f00-8a00-000000000002',
      fieldMetadataUniversalIdentifier: OPPORTUNITY_ON_REQUIREMENT_FIELD_ID,
      position: 1,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: 'f0a0b0c0-d0e0-4f00-8a00-000000000003',
      fieldMetadataUniversalIdentifier: REQUIREMENT_QUANTITY_FIELD_ID,
      position: 2,
      isVisible: true,
      size: 120,
    },
    {
      universalIdentifier: 'f0a0b0c0-d0e0-4f00-8a00-000000000004',
      fieldMetadataUniversalIdentifier: REQUIREMENT_WH_PRODUCT_ID_FIELD_ID,
      position: 3,
      isVisible: true,
      size: 180,
    },
  ],
});
