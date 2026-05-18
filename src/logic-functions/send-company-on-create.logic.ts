import { defineLogicFunction } from 'twenty-sdk/define';

import { emitCompanyEvent } from './send-integration-event.util';

export default defineLogicFunction({
  universalIdentifier: 'e5f4d9b0-7a31-4c6d-a0f8-640110100001',
  name: 'Send Company To WarehouseCore On Create',
  description: 'Sends newly created companies to WarehouseCore integration endpoint.',
  timeoutSeconds: 10,
  databaseEventTriggerSettings: {
    eventName: 'company.created',
  },
  handler: async (event) => emitCompanyEvent(event, 'upsert'),
});
