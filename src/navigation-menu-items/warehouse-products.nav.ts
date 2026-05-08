import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { WH_PRODUCTS_VIEW_ID } from '../views/warehouse-products.view';

export default defineNavigationMenuItem({
  universalIdentifier: 'c3d4e5f6-a7b8-4903-9cde-f01234567890',
  name: 'WH Products',
  icon: 'IconBox',
  color: 'green',
  position: 11,
  type: NavigationMenuItemType.VIEW,
  viewUniversalIdentifier: WH_PRODUCTS_VIEW_ID,
});
