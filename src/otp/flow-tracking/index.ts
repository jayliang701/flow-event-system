/**
 * Each business page should have its own Flow Tracking Context.
 */

import * as React from "react";
import {
  FlowTrackingContextState,
  withFlowTracking,
} from "../../flow-tracking";

import type { OtpFlowEvents } from "./tracker";

const OtpFlowTrackingContext = React.createContext<
  FlowTrackingContextState<OtpFlowEvents>
>({ onFlowEvent: () => {} });

export function useOtpFlowEvent() {
  const context = React.useContext(OtpFlowTrackingContext);
  return context;
}

export function withOtpFlowEvent() {
  return withFlowTracking(
    OtpFlowTrackingContext,
    // this argument can be treated as a Flow Tracking Context factory function
    // it can be async, then we can lazy load it to reduce bundle size
    // business side can still fire the flow events without waiting it is loaded
    // flow-tracking sdk will take care of it, add them to pending list first
    async () => {
      // await new Promise((resolve) => setTimeout(resolve, 2000));  // mock slow network
      const { default: createTracker } = await import("./tracker");
      const tracker = createTracker();

      return tracker;
    },
    // sync approach
    // createTracker  // import createTracker from './tracker'
  );
}
