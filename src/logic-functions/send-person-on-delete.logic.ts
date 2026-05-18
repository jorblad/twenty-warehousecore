import { defineLogicFunction } from 'twenty-sdk/define';

import { emitPersonEvent } from './send-integration-event.util';

export default defineLogicFunction({
  universalIdentifier: 'e5f4d9b0-7a31-4c6d-a0f8-640110100012',
  name: 'Send Person To WarehouseCore On Delete',
  description: 'Sends deleted people to WarehouseCore integration endpoint.',
  timeoutSeconds: 10,
  databaseEventTriggerSettings: {
    eventName: 'person.deleted',
  },
  handler: async (event) => emitPersonEvent(event, 'delete'),
});
