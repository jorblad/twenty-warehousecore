import { defineApplication } from 'twenty-sdk/define';

// Register only integration outbound sync logic.
import 'src/logic-functions/send-company-on-create.logic';
import 'src/logic-functions/send-company-on-update.logic';
import 'src/logic-functions/send-company-on-delete.logic';
import 'src/logic-functions/send-opportunity-on-create.logic';
import 'src/logic-functions/send-opportunity-on-update.logic';
import 'src/logic-functions/send-opportunity-on-delete.logic';
import 'src/logic-functions/send-person-on-create.logic';
import 'src/logic-functions/send-person-on-update.logic';
import 'src/logic-functions/send-person-on-delete.logic';

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
