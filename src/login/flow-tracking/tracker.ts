/**
 * Each business page should have its own tracker.
 */
import { ToEventDefinition } from "../../flow-tracking";

// This function return can be treated as a Flow Tracking Context
export default function createLoginFlowTracker() {
  const state: any = {
    scenario: "default",
  };

  // a flow event handler
  const pageDidMount = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const scenario = urlParams.get("scenario") || "default";
    state.scenario = scenario;

    // Todo: invoke TMS tracking API or trace pageLoad performance metric
    console.log("pageDidMount", state);
  };

  // a flow event handler
  const clickLoginButton = ({
    credentialType,
  }: {
    credentialType: "phone" | "email";
  }) => {
    // Todo: invoke TMS tracking API
    // scenario doesn't need to be passed again
    console.log("clickLoginButton", state, credentialType);
  };

  return {
    pageDidMount,
    clickLoginButton,
  };
}

export type LoginFlowEvents = ToEventDefinition<typeof createLoginFlowTracker>;
