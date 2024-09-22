import * as React from 'react';
import { FlowEventContextValue, FlowEventTracker, PageFlowEventTracker } from './types';

export * from './types';

// Page Level
const PageEventContext: React.Context<FlowEventContextValue<any>> = (() => {
  let context = (window as any).__$pageEventContext;
  if (!context) {
    context = React.createContext<FlowEventContextValue<any>>({
      trackEvent: () => false,
    });
    (window as any).__$pageEventContext = context; // ensure singleton
  }
  return context;
})();

// a helper function to "create" Page/Component FlowEventContext
export function createFlowEventContext<EventDefinition>() {
  const context = PageEventContext as React.Context<FlowEventContextValue<EventDefinition>>;
  return context;
}

export function usePageEventContext<EventDefinition>(): FlowEventContextValue<EventDefinition> {
  return React.useContext(PageEventContext);
}

export function withPageEvent<
  EventDefinition,
  FlowEventState extends object = {},
  Props extends object = {},
>(state: FlowEventState, tracker: PageFlowEventTracker<EventDefinition>) {
  const initialState = { ...state };

  return (Component: React.ComponentType<Props>) => {
    return (props: Props) => {
      const flowEventState = React.useRef(initialState);

      const trackEvent = <EventName extends keyof EventDefinition>(
        name: EventName,
        ...args: undefined extends EventDefinition[EventName]
          ? [details?: EventDefinition[EventName]]
          : [details: EventDefinition[EventName]]
      ) => {
        const handler = tracker.handlers[name];
        if (handler) {
          console.log(`[${tracker.name}] track event --> ${String(name)}     args:`, args);
          const ret = handler.apply(tracker, args);
          if (ret == null) {
            // no state change
          } else if (typeof ret === 'function') {
            // state change
            const nestedRet = ret({ state: Object.freeze({ ...flowEventState.current }) });
            if (nestedRet && typeof nestedRet === 'object') {
              flowEventState.current = { ...flowEventState.current, ...nestedRet };
            }
          } else {
            // state change
            flowEventState.current = { ...flowEventState.current, ...ret };
          }
          return true;
        } else {
          return false;
        }
      };

      const trackSubTrackerEvent = <
        ComponentEventDefinition,
        ComponentFlowEventState extends object = {},
      >({
        trackerName,
        eventName,
        getState,
        updateState,
        args,
      }: {
        trackerName: string;
        eventName: keyof ComponentEventDefinition;
        args: undefined extends ComponentEventDefinition[keyof ComponentEventDefinition]
          ? [details?: ComponentEventDefinition[keyof ComponentEventDefinition]]
          : [details: ComponentEventDefinition[keyof ComponentEventDefinition]];
        getState: () => ComponentFlowEventState;
        updateState: (state: Partial<ComponentFlowEventState>) => void;
      }) => {
        const subTracker = tracker.subTrackers ? tracker.subTrackers[trackerName] : undefined;
        const overridedHandler = subTracker?.handlers[eventName];
        if (overridedHandler) {
          console.log(
            `[${tracker.name}][${trackerName}] track event --> ${String(eventName)}     args:`,
            args,
          );
          const ret = overridedHandler.apply(tracker, args);
          if (ret == null) {
            // no state change
          } else if (typeof ret === 'function') {
            // state change
            const currentSubState = getState();
            const nestedRet = ret({
              state: currentSubState,
              // @ts-ignore
              pageState: Object.freeze({ ...flowEventState.current }),
            });
            if (nestedRet && typeof nestedRet === 'object') {
              updateState({ ...currentSubState, ...nestedRet });
            }
          } else {
            // state change
            updateState({ ...getState(), ...ret });
          }
          return true;
        }
        return false;
      };

      const RootEventContext = PageEventContext as React.Context<
        FlowEventContextValue<EventDefinition>
      >;
      return (
        <RootEventContext.Provider
          value={
            {
              trackEvent,
              trackSubTrackerEvent,
            } as any
          }
        >
          <Component {...props} />
        </RootEventContext.Provider>
      );
    };
  };
}

export function createComponentEventContext<EventDefinition, FlowEventState extends object = {}>(
  state: FlowEventState,
  tracker: FlowEventTracker<EventDefinition>,
) {
  const initialState = { ...state };

  const ComponentEventContext = React.createContext<FlowEventContextValue<EventDefinition>>({
    trackEvent: () => false,
  });

  const useComponentEventContext = () => {
    return React.useContext(ComponentEventContext);
  };

  const withComponentEvent = <Props extends object = {}>(Component: React.ComponentType<Props>) => {
    return (props: Props) => {
      const flowEventState = React.useRef(initialState);
      const pageEventContext = usePageEventContext<EventDefinition>();

      const trackEvent = <EventName extends keyof EventDefinition>(
        name: EventName,
        ...args: undefined extends EventDefinition[EventName]
          ? [details?: EventDefinition[EventName]]
          : [details: EventDefinition[EventName]]
      ) => {
        if (
          pageEventContext &&
          (pageEventContext as any).trackSubTrackerEvent({
            trackerName: tracker.name,
            eventName: name,
            args,
            getState: () => Object.freeze({ ...flowEventState.current }),
            updateState: (upserts: Partial<FlowEventState>) => {
              flowEventState.current = { ...flowEventState.current, ...upserts };
            },
          })
        ) {
          return true;
        }
        const handler = tracker.handlers[name];
        if (handler) {
          console.log(`[${tracker.name}] track event --> ${String(name)}     args:`, args);
          const ret = handler.apply(tracker, args);
          if (ret == null) {
            // no state change
          } else if (typeof ret === 'function') {
            // state change
            const nestedRet = ret({ state: Object.freeze({ ...flowEventState.current }) });
            if (nestedRet && typeof nestedRet === 'object') {
              flowEventState.current = { ...flowEventState.current, ...nestedRet };
            }
          } else {
            // state change
            flowEventState.current = { ...flowEventState.current, ...ret };
          }
          return true;
        } else {
          return false;
        }
      };

      return (
        <ComponentEventContext.Provider value={{ trackEvent }}>
          <Component {...props} />
        </ComponentEventContext.Provider>
      );
    };
  };

  return {
    ComponentEventContext,
    useComponentEventContext,
    withComponentEvent,
  };
}
