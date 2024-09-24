/**
 * Shared Component could have its own Flow Event Context.
 */

import { createComponentEventContext } from '../../flow-event';

import {
  TRACKER_NAME as OTP_FLOW_TRACKER_NAME,
  createInitialState,
  createTracker,
  OtpFlowEventDefinition,
  OtpFlowEventState,
  OtpFlowEventHandlers,
} from './tracker';

const {
  ComponentEventContext: OtpFlowEventContext,
  useComponentEventContext: useOtpFlowEvent,
  withComponentEvent: withOtpFlowEvent,
} = createComponentEventContext<OtpFlowEventDefinition, OtpFlowEventState>(
  createInitialState(),
  createTracker(),
);

export type { OtpFlowEventDefinition, OtpFlowEventState, OtpFlowEventHandlers };

export { OTP_FLOW_TRACKER_NAME, OtpFlowEventContext, useOtpFlowEvent, withOtpFlowEvent };
