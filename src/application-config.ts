import { defineApplication } from 'twenty-sdk/define';

// Register custom definitions via side-effect imports so Twenty sync includes
// these objects/fields/views/navigation items in the app manifest.
import 'src/objects/job-product-requirement.object';
import 'src/objects/warehouse-product.object';
import 'src/fields/warehouse-job-id-on-opportunity.field';
import 'src/fields/job-code-on-opportunity.field';
import 'src/fields/job-dates-on-opportunity.field';
import 'src/fields/job-end-date-on-opportunity.field';
import 'src/fields/job-requirements-on-opportunity.field';
import 'src/fields/opportunity-on-job-requirement.field';
import 'src/fields/product-on-job-requirement.field';
import 'src/fields/job-requirements-on-wh-product.field';
import 'src/views/job-product-requirements.view';
import 'src/views/warehouse-products.view';
import 'src/navigation-menu-items/job-product-requirements.nav';
import 'src/navigation-menu-items/warehouse-products.nav';

import {
  APP_DESCRIPTION,
  APP_DISPLAY_NAME,
  APPLICATION_UNIVERSAL_IDENTIFIER,
  DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineApplication({
  universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  displayName: APP_DISPLAY_NAME,
  description: APP_DESCRIPTION,
  defaultRoleUniversalIdentifier: DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,
});
