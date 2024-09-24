import * as React from 'react';
import { useAccountBindFlowEvent, withAccountBindFlowEvent } from './flow-event';

const AccountBindPage = () => {
  const { trackEvent } = useAccountBindFlowEvent();

  React.useEffect(() => {
    trackEvent('pageDidMount');
  }, []);

  return (
    <div>
      <h1>AccountBindPage</h1>
      <div>Are you confirm to bind this Account?</div>
      <button
        onClick={() => {
          trackEvent('clickBindButton');
        }}
      >
        Yes, Bind
      </button>
    </div>
  );
};

export default withAccountBindFlowEvent()(AccountBindPage);
