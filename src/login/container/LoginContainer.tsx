import * as React from 'react';
import { useLoginFlowEvent } from '../flow-event';

const LoginContainer = ({ goNext }: any) => {
  const { trackEvent } = useLoginFlowEvent();
  const [phone, setPhone] = React.useState('');

  React.useEffect(() => {}, []);

  return (
    <div>
      <h1>LoginPage</h1>
      <div style={{ padding: 24 }}>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <button
        onClick={() => {
          trackEvent('clickNextButton', { authKey: phone, authKeyType: 'phone' });
          goNext && goNext();
        }}
      >
        Login
      </button>
    </div>
  );
};

export default LoginContainer;
