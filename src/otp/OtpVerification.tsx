import * as React from 'react';
import { withOtpFlowEvent, useOtpFlowEvent } from './flow-event';

function OtpVerification({ onSuccess }: any) {
  const { trackEvent } = useOtpFlowEvent();
  React.useEffect(() => {
    trackEvent('begin', { scenario: undefined });
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <div>
        <input value={'123456'} />
      </div>
      <div style={{ marginTop: '16px' }}>
        <button
          type="button"
          onClick={() => {
            trackEvent('clickVerifyButton');
            onSuccess && onSuccess();
          }}
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
}

export default withOtpFlowEvent()(OtpVerification);
