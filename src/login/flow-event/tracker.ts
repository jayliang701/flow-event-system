/**
 * Each business page should have its own tracker.
 */
import type { OtpFlowEvents } from '../../otp/flow-event';

// This function return can be treated as a Flow Tracking Context
export function loginFlowEventHandlerCreator(
  context: any,
  setContext: (context: any) => any
) {
  // a flow event handler
  const pageDidMount = () => {
    // restore

    const urlParams = new URLSearchParams(window.location.search);
    const scenario = urlParams.get('scenario') || 'default';
    setContext({
      scenario,
    });

    // Todo: invoke TMS tracking API or trace pageLoad performance metric
    console.log('[Login Page Event] pageDidMount', context);
  };

  // a flow event handler
  const clickLoginButton = ({
    credentialType,
  }: {
    credentialType: 'phone' | 'email';
  }) => {
    // Todo: invoke TMS tracking API
    // scenario doesn't need to be passed again
    console.log('[Login Page Event] clickLoginButton', context, credentialType);
  };

  const overrides = {
    otp: {
      inject: () => {
        pageType: 'xxx';
      },
    },
  };

  (redirect) => {
    // save context
  };

  return {
    pageDidMount,
    clickLoginButton,
  };
}
