import * as React from 'react';
import { withLoginFlowEvent, useLoginFlowEvent } from './flow-event';
import OtpContainer from './container/OtpContainer';
import LoginContainer from './container/LoginContainer';

const LoginPage = () => {
  const { trackEvent } = useLoginFlowEvent();
  const [view, setView] = React.useState(1);

  React.useEffect(() => {
    // fire a business flow event
    trackEvent('pageDidMount');
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
