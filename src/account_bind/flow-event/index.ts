/**
 * Each Shared Component could have its own Flow Event Context.
 */

import { usePageEventContext, withPageEvent } from '../../flow-event';

import {
  createInitialState,
  createTracker,
  AccountBindPageFlowEventDefinition,
  AccountBindPageFlowEventState,
} from './tracker';

export function useAccountBindFlowEvent() {
  return usePageEventContext<AccountBindPageFlowEventDefinition>();
}

export function withAccountBindFlowEvent<Props extends object = {}>() {
  return withPageEvent<AccountBindPageFlowEventDefinition, AccountBindPageFlowEventState, Props>(
    createInitialState(),
    createTracker(),
  );
}
