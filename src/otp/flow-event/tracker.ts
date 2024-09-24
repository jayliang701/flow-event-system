import { FlowEventHandlers } from '../../flow-event';

export const TRACKER_NAME = 'OtpVerification';

export type OtpFlowEventState = {
  authKeyType: 'phone' | 'email' | null;
  channel: string | null;
};

export const createInitialState = (): OtpFlowEventState => {
  return {
    authKeyType: null,
    channel: null,
  };
};

export type OtpFlowEventDefinition = {
  begin: { authKeyType: 'phone' | 'email' };
  clickVerifyButton: { channel: string };
};

export type OtpFlowEventHandlers = FlowEventHandlers<OtpFlowEventDefinition, OtpFlowEventState>;

export function createTracker() {
  const handlers: OtpFlowEventHandlers = {
    begin({ authKeyType }) {
      return ({ state }) => {
        console.log('begin', { ...state, authKeyType });
        return {
          authKeyType,
        };
      };
    },
    clickVerifyButton({ channel }) {
      return ({ state }) => {
        console.log('clickVerifyButton', { ...state, channel });
        return {
          channel,
        };
      };
    },
  };

  return {
    name: TRACKER_NAME,
    handlers,
  };
}
