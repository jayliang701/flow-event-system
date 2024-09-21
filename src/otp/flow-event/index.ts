/**
 * Shared Component could have its own Flow Event Context.
 */

import {
  ToEventDefinition,
  usePageEventContext,
  withPageEvent,
} from '../../flow-event';

import { createOtpFlowTracker } from './tracker';

export type OtpFlowEvents = ToEventDefinition<typeof createOtpFlowTracker>;

export function useOtpFlowEvent() {
  return usePageEventContext<OtpFlowEvents>();
}

export function withOtpFlowEvent<Props extends object = {}>() {
  return withPageEvent<OtpFlowEvents, Props>(createOtpFlowTracker());
}
