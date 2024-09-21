/**
 * Each Shared Component could have its own Flow Event Context.
 */

import {
  ToEventDefinition,
  usePageEventContext,
  withPageEvent,
  createFlowEventTracker,
} from '../../flow-event';

import { loginFlowEventHandlerCreator } from './tracker';

const TRACKER_NAME = 'LoginPage';

export type LoginFlowEvents = ToEventDefinition<
  typeof loginFlowEventHandlerCreator
>;

export function useLoginFlowEvent() {
  return usePageEventContext<LoginFlowEvents>();
}

const tracker = createFlowEventTracker(TRACKER_NAME, {
  context: {},
  handlerCreator: loginFlowEventHandlerCreator,
  subTrackers: {},
});

export function withLoginFlowEvent<Props extends object = {}>() {
  return withPageEvent<LoginFlowEvents, Props>(tracker);
}
