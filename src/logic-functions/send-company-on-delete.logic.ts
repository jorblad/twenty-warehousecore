import { defineLogicFunction } from 'twenty-sdk/define';

import { emitCompanyEvent } from './send-integration-event.util';

export default defineLogicFunction({
  universalIdentifier: 'e5f4d9b0-7a31-4c6d-a0f8-640110100003',
  name: 'Send Company To WarehouseCore On Delete',
  description: 'Sends deleted companies to WarehouseCore integration endpoint.',
  timeoutSeconds: 10,
  databaseEventTriggerSettings: {
    eventName: 'company.deleted',
  },
  handler: async (event) => emitCompanyEvent(event, 'delete'),
});
