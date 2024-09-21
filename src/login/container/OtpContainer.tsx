import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import OtpVerification from '../../otp/OtpVerification';
import { useLoginFlowEvent } from '../flow-event';

const OtpContainer = () => {
  const { trackEvent } = useLoginFlowEvent();
  const navigate = useNavigate();

  React.useEffect(() => {}, []);

  const onOtpSuccess = () => {
    trackEvent('requireLoginFurtherAction', { scenario: 'account_bind' });
    navigate('/account-bind');
  };

  return (
    <div>
      <h1>OTP Verification</h1>
      <div>
        <OtpVerification onSuccess={onOtpSuccess} />
      </div>
    </div>
  );
};

export default OtpContainer;
