import { defineView, ViewKey } from 'twenty-sdk/define';

import {
  WH_PRODUCT_UNIVERSAL_IDENTIFIER,
  WH_PRODUCT_NAME_FIELD_ID,
  WH_PRODUCT_WAREHOUSE_ID_FIELD_ID,
  WH_PRODUCT_CATEGORY_FIELD_ID,
  WH_PRODUCT_LAST_SYNC_FIELD_ID,
} from '../objects/warehouse-product.object';

export const WH_PRODUCTS_VIEW_ID = 'b2c3d4e5-f6a7-4891-8bcd-ef0123456789';

export default defineView({
  universalIdentifier: WH_PRODUCTS_VIEW_ID,
  name: 'All Products',
  objectUniversalIdentifier: WH_PRODUCT_UNIVERSAL_IDENTIFIER,
  icon: 'IconBox',
  key: ViewKey.INDEX,
  position: 0,
  fields: [
    {
      universalIdentifier: 'c0d0e0f0-a0b0-4c00-8c00-000000000001',
      fieldMetadataUniversalIdentifier: WH_PRODUCT_NAME_FIELD_ID,
      position: 0,
      isVisible: true,
      size: 280,
    },
    {
      universalIdentifier: 'c0d0e0f0-a0b0-4c00-8c00-000000000002',
      fieldMetadataUniversalIdentifier: WH_PRODUCT_CATEGORY_FIELD_ID,
      position: 1,
      isVisible: true,
      size: 180,
    },
    {
      universalIdentifier: 'c0d0e0f0-a0b0-4c00-8c00-000000000003',
      fieldMetadataUniversalIdentifier: WH_PRODUCT_WAREHOUSE_ID_FIELD_ID,
      position: 2,
      isVisible: true,
      size: 140,
    },
    {
      universalIdentifier: 'c0d0e0f0-a0b0-4c00-8c00-000000000004',
      fieldMetadataUniversalIdentifier: WH_PRODUCT_LAST_SYNC_FIELD_ID,
      position: 3,
      isVisible: true,
      size: 160,
    },
  ],
});
