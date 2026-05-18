import { defineLogicFunction } from 'twenty-sdk/define';

import { emitCompanyEvent } from './send-integration-event.util';

export default defineLogicFunction({
  universalIdentifier: 'e5f4d9b0-7a31-4c6d-a0f8-640110100002',
  name: 'Send Company To WarehouseCore On Update',
  description: 'Sends updated companies to WarehouseCore integration endpoint.',
  timeoutSeconds: 10,
  databaseEventTriggerSettings: {
    eventName: 'company.updated',
  },
  handler: async (event) => emitCompanyEvent(event, 'upsert'),
});
