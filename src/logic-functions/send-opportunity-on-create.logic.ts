import { defineLogicFunction } from 'twenty-sdk/define';

import { emitOpportunityEvent } from './send-integration-event.util';

export default defineLogicFunction({
  universalIdentifier: 'e5f4d9b0-7a31-4c6d-a0f8-640110100004',
  name: 'Send Opportunity To WarehouseCore On Create',
  description: 'Sends newly created opportunities to WarehouseCore integration endpoint.',
  timeoutSeconds: 10,
  databaseEventTriggerSettings: {
    eventName: 'opportunity.created',
  },
  handler: async (event) => emitOpportunityEvent(event, 'upsert'),
});
