import { defineLogicFunction } from 'twenty-sdk/define';

import { emitPersonEvent } from './send-integration-event.util';

export default defineLogicFunction({
  universalIdentifier: 'e5f4d9b0-7a31-4c6d-a0f8-640110100011',
  name: 'Send Person To WarehouseCore On Update',
  description: 'Sends updated people to WarehouseCore integration endpoint.',
  timeoutSeconds: 10,
  databaseEventTriggerSettings: {
    eventName: 'person.updated',
  },
  handler: async (event) => emitPersonEvent(event, 'upsert'),
});
