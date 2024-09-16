import * as React from "react";
import { withOtpFlowEvent, useOtpFlowEvent } from "./flow-tracking";

function OtpVerification() {
  const { onFlowEvent } = useOtpFlowEvent();
  React.useEffect(() => {
    onFlowEvent("begin", { scenario: "login-by-password" });
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <div>
        <input value={"123456"} />
      </div>
      <div style={{ marginTop: "16px" }}>
        <button
          type="button"
          onClick={() => {
            onFlowEvent("clickVerifyButton");
          }}
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
}

export default withOtpFlowEvent()(OtpVerification);
