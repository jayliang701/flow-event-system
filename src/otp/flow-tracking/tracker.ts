import { ToEventDefinition } from "../../flow-tracking";

export default function createOtpFlowTracker() {
  const state: any = {};

  const begin = ({ scenario }: { scenario: string }) => {
    state.scenario = scenario;
    console.log("otp begin", scenario);
  };

  const clickVerifyButton = () => {
    console.log("clickVerifyButton", state);
  };

  return {
    begin,
    clickVerifyButton,
  };
}

export type OtpFlowEvents = ToEventDefinition<typeof createOtpFlowTracker>;
