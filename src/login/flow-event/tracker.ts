import { FlowEventHandlers } from '../../flow-event';
import { OTP_FLOW_TRACKER_NAME, OtpFlowEventHandlers } from '../../otp/flow-event';

export const TRACKER_NAME = 'LoginPage';

export type LoginPageFlowEventState = {
  fromSource: string | null;
  authKey: string | null;
  authKeyType: 'phone' | 'email' | null;
};

export const createInitialState = (): LoginPageFlowEventState => {
  return {
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
  const handlers: FlowEventHandlers<LoginPageFlowEventDefinition, LoginPageFlowEventState> = {
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

  const otpHandlers: OtpFlowEventHandlers = {
    begin({ authKeyType }) {
      return ({ state }) => {
        console.log('[Override] begin', { ...state, authKeyType });
        return {
          authKeyType,
        };
      };
    },
    clickVerifyButton({ channel }) {
      return ({ state }) => {
        console.log('[Override] clickVerifyButton', { ...state, channel });
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
