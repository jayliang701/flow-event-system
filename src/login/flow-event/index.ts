/**
 * Each Shared Component could have its own Flow Event Context.
 */

import { usePageEventContext, withPageEvent } from '../../flow-event';

import {
  createInitialState,
  createTracker,
  LoginPageFlowEventDefinition,
  LoginPageFlowEventState,
} from './tracker';

export function useLoginFlowEvent() {
  return usePageEventContext<LoginPageFlowEventDefinition>();
}

export function withLoginFlowEvent<Props extends object = {}>() {
  return withPageEvent<LoginPageFlowEventDefinition, LoginPageFlowEventState, Props>(
    createInitialState(),
    createTracker(),
  );
}
