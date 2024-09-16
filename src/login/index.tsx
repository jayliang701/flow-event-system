import * as React from 'react';
import { withLoginFlowEvent, useLoginFlowEvent } from './flow-tracking';
import OtpVerification from '../otp/OtpVerification';

const LoginPage = () => {
  const { onFlowEvent } = useLoginFlowEvent();

  React.useEffect(() => {
    // fire a business flow event
    onFlowEvent('pageDidMount');
  }, []);

  return (
    <div>
      <h1>LoginPage</h1>
      <div>
        <OtpVerification />
      </div>
      <button
        onClick={() => {
          // fire a business flow event with payload
          onFlowEvent('clickLoginButton', { credentialType: 'phone' });

          // can't not fire a unsupported flow event, or pass payload wrongly
          // [×] onFlowEvent("clickLoginButton");
          // [×] onFlowEvent("clickSignupButton", { a:1, b:2 });
        }}
      >
        Login
      </button>
      <div style={{ padding: 24 }}>{window.navigator.userAgent}</div>
    </div>
  );
};

export default withLoginFlowEvent()(LoginPage);
