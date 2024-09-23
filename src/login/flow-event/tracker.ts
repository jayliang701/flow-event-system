import { FlowEventHandlers, ToSubFlowEventHandlers } from '../../flow-event';
import {
  OTP_FLOW_TRACKER_NAME,
  OtpFlowEventHandlers,
} from '../../otp/flow-event';

export const TRACKER_NAME = 'LoginPage';

export type LoginPageFlowEventState = {
  pageType: string | null;
  fromSource: string | null;
  authKey: string | null;
  authKeyType: 'phone' | 'email' | null;
};

export const createInitialState = (): LoginPageFlowEventState => {
  return {
    pageType: 'login',
    fromSource: null,
    authKey: null,
    authKeyType: null,
  };
};

export type LoginPageFlowEventDefinition = {
  pageDidMount: undefined;
  clickNextButton: { authKey: string; authKeyType: 'phone' | 'email' };
  requireLoginFurtherAction: { scenario: 'account_bind' | 'ivs' };
};

export function createTracker() {
  // page event handlers
  const handlers: FlowEventHandlers<
    LoginPageFlowEventDefinition,
    LoginPageFlowEventState
  > = {
    pageDidMount() {
      return ({ state }) => {
        const url = new URL(window.location.href);
        const fromSource = url.searchParams.get('from');
        console.log('pageDidMount -->', { ...state, fromSource });
        // return Partial State if you need to update the state
        return {
          fromSource,
        };
      };
    },
    clickNextButton({ authKey, authKeyType }) {
      return ({ state }) => {
        console.log('clickNextButton -->', { ...state, authKey, authKeyType });
        return {
          authKey,
          authKeyType,
        };
      };
    },
    requireLoginFurtherAction({ scenario }) {
      return ({ state }) => {
        console.log('onLoginFurtherAction -->', { ...state, scenario });
        // return void if you don't need to update the state
      };
    },
  };

  // override Component level event handlers
  // can be Partial<OtpFlowEventHandlers>, means partially override event handlers
  const otpHandlers: ToSubFlowEventHandlers<
    OtpFlowEventHandlers,
    LoginPageFlowEventState
  > = {
    begin({ authKeyType }) {
      return ({ state, pageState }) => {
        console.log('[Override] begin', { ...state, authKeyType });
        console.log('pageState ---> ', pageState);
        return {
          authKeyType,
        };
      };
    },
    clickVerifyButton({ channel }) {
      return ({ state, pageState }) => {
        console.log('[Override] clickVerifyButton', { ...state, channel });
        // we can get Page level flow event context state values
        console.log(
          `Verify OTP with: \n- authKeyType: ${pageState.authKeyType}\n- channel: ${channel}\n- pageType: ${pageState.pageType}`
        );
        return {
          channel,
        };
      };
    },
  };

  return {
    name: TRACKER_NAME,
    handlers,
    subTrackers: {
      [OTP_FLOW_TRACKER_NAME]: {
        handlers: otpHandlers,
      },
    },
  };
}
