import * as React from 'react';
import { withLoginFlowEvent, useLoginFlowEvent } from './flow-tracking';
import OtpVerification from '../otp/OtpVerification';

// const Test = ({ show }) => {
//   React.useEffect(() => {
//     let toastTimeout: ReturnType<typeof setTimeout>;
//     if (show) {
//       toastTimeout = setTimeout(() => {
//         console.log("dismiss");
//       }, 2000);
//       console.log("create timeout ---> ", toastTimeout);
//     }

//     return () => {
//       console.log("clear timeout ---> ", toastTimeout);
//       if (toastTimeout) {
//         clearTimeout(toastTimeout);
//       }
//     };
//   }, [show]);
//   return show && <div>Test</div>;
// };

const LoginPage = () => {
  const { onFlowEvent } = useLoginFlowEvent();

  const [show, setShow] = React.useState(false);

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
          // onFlowEvent("clickLoginButton", { credentialType: "phone" });
          setShow(!show);

          // can't not fire a unsupported flow event, or pass payload wrongly
          // [×] onFlowEvent("clickLoginButton");
          // [×] onFlowEvent("clickSignupButton", { a:1, b:2 });
        }}
      >
        Login
      </button>
      <div style={{ padding: 24 }}>{window.navigator.userAgent}</div>
      {/* <Test show={show} /> */}
    </div>
  );
};

export default withLoginFlowEvent()(LoginPage);
