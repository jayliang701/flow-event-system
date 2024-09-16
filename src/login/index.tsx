import * as React from 'react';
import { withLoginFlowEvent, useLoginFlowEvent } from './flow-tracking';
import OtpContainer from './container/OtpContainer';
import LoginContainer from './container/LoginContainer';

const LoginPage = () => {
  const { onFlowEvent } = useLoginFlowEvent();
  const [view, setView] = React.useState(1);

  React.useEffect(() => {
    // fire a business flow event
    onFlowEvent('pageDidMount');
  }, []);

  return (
    <>
      {view === 1 ? (
        <LoginContainer
          goNext={() => {
            setView(2);
          }}
        />
      ) : (
        <OtpContainer />
      )}
    </>
  );
};

export default withLoginFlowEvent()(LoginPage);
