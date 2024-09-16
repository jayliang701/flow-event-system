import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import OtpVerification from '../../otp/OtpVerification';

const OtpContainer = () => {
  const navigate = useNavigate();

  React.useEffect(() => {}, []);

  return (
    <div>
      <h1>OTP Verification</h1>
      <div>
        <OtpVerification onSuccess={() => navigate('/account-bind')} />
      </div>
    </div>
  );
};

export default OtpContainer;
