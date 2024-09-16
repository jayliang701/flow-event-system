import * as React from 'react';

const LoginContainer = ({ goNext }: any) => {
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
          goNext && goNext();
        }}
      >
        Login
      </button>
    </div>
  );
};

export default LoginContainer;
