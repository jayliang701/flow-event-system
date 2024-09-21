export function createOtpFlowTracker() {
  const state: any = {};

  const begin = ({ scenario }: { scenario?: string }) => {
    state.scenario = scenario;
  };

  const clickVerifyButton = () => {
    console.log('[OTP Event] clickVerifyButton', state);
  };

  return {
    getContext: () => {
      const copy: Readonly<typeof state> = { ...state };
      return copy;
    },
    begin,
    clickVerifyButton,
  };
}
