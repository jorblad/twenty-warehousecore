import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { JOB_REQUIREMENTS_VIEW_ID } from '../views/job-product-requirements.view';

export default defineNavigationMenuItem({
  universalIdentifier: 'b1b2b3b4-b5b6-4789-8bbb-012345678901',
  name: 'Job Requirements',
  icon: 'IconPackage',
  color: 'blue',
  position: 10,
  type: NavigationMenuItemType.VIEW,
  viewUniversalIdentifier: JOB_REQUIREMENTS_VIEW_ID,
});
