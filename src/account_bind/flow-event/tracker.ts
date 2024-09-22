import { FlowEventHandlers } from '../../flow-event';

export const TRACKER_NAME = 'AccountBindPage';

export type AccountBindPageFlowEventState = {
  fromSource: string | null;
  authKey: string | null;
  authKeyType: 'phone' | 'email' | null;
};

export const createInitialState = (): AccountBindPageFlowEventState => {
  return {
    fromSource: null,
    authKey: null,
    authKeyType: null,
  };
};

export type AccountBindPageFlowEventDefinition = {
  pageDidMount: undefined;
  clickBindButton: undefined;
  showErrorToast: { error_code: number };
};

export function createTracker() {
  const handlers: FlowEventHandlers<
    AccountBindPageFlowEventDefinition,
    AccountBindPageFlowEventState
  > = {
    pageDidMount() {
      return ({ state }) => {
        const url = new URL(window.location.href);
        const fromSource = url.searchParams.get('from');
        console.log('pageDidMount -->', { ...state, fromSource });
        return {
          fromSource,
        };
      };
    },
    clickBindButton() {
      return ({ state }) => {
        console.log('clickBindButton -->', { ...state });
      };
    },
    showErrorToast({ error_code }) {
      return ({ state }) => {
        console.log('showErrorToast -->', { ...state, error_code });
      };
    },
  };

  return {
    name: TRACKER_NAME,
    handlers,
  };
}
