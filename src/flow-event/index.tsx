import * as React from 'react';
import {
  FlowEventContextValue,
  FlowEventTracker,
  InternalPageFlowEventContextValue,
  PageFlowEventTracker,
} from './types';

export * from './types';

// Page Level
// ensure singleton, maybe it's not necessary~~
function getPageEventContext(): React.Context<FlowEventContextValue<any>> {
  let context = (window as any).__$pageEventContext;
  if (!context) {
    context = React.createContext<FlowEventContextValue<any>>({
      trackEvent: () => false,
    });
    (window as any).__$pageEventContext = context;
  }
  return context;
}

// a helper function to "create" Page/Component FlowEventContext
export function createFlowEventContext<EventDefinition>() {
  const context = getPageEventContext() as React.Context<
    FlowEventContextValue<EventDefinition>
  >;
  return context;
}

export function usePageEventContext<EventDefinition>() {
  return React.useContext(
    getPageEventContext()
  ) as FlowEventContextValue<EventDefinition>;
}

function useInternalPageEventContext<EventDefinition>() {
  const pageEventContext = React.useContext(
    getPageEventContext()
  ) as InternalPageFlowEventContextValue<EventDefinition>;
  if (pageEventContext.trackSubTrackerEvent == null) {
    // parent page doesn't wrap by context provider
    return null;
  }
  return pageEventContext;
}

export function withPageEvent<
  EventDefinition,
  FlowEventState extends object = {},
  Props extends object = {}
>(
  state: FlowEventState,
  tracker: PageFlowEventTracker<EventDefinition, FlowEventState>
) {
  const initialState = { ...state };

  return (Component: React.ComponentType<Props>) => {
    // this type casting is a hacking
    const RootEventContext = getPageEventContext() as any as React.Context<
      InternalPageFlowEventContextValue<EventDefinition>
    >;

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
          console.log(
            `[${tracker.name}] track event --> ${String(name)}     args:`,
            args
          );
          const ret = handler.apply(tracker, args);
          if (ret == null) {
            // no state change
          } else if (typeof ret === 'function') {
            // state change
            const nestedRet = ret({
              state: Object.freeze({ ...flowEventState.current }),
            });
            if (nestedRet && typeof nestedRet === 'object') {
              flowEventState.current = {
                ...flowEventState.current,
                ...nestedRet,
              };
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
        ComponentFlowEventState extends object = {}
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
        const subTracker = tracker.subTrackers
          ? tracker.subTrackers[trackerName]
          : undefined;
        const overridedHandler = subTracker?.handlers[eventName];
        if (overridedHandler) {
          console.log(
            `[${tracker.name}][${trackerName}] track event --> ${String(
              eventName
            )}     args:`,
            args
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

      return (
        <RootEventContext.Provider
          value={
            {
              trackEvent,
              trackSubTrackerEvent, // this function is be protected
            } as any
          }
        >
          <Component {...props} />
        </RootEventContext.Provider>
      );
    };
  };
}

// Component Level
export function createComponentEventContext<
  EventDefinition,
  FlowEventState extends object = {}
>(state: FlowEventState, tracker: FlowEventTracker<EventDefinition>) {
  const initialState = { ...state };

  const ComponentEventContext = React.createContext<
    FlowEventContextValue<EventDefinition>
  >({
    trackEvent: () => false,
  });

  const useComponentEventContext = () => {
    return React.useContext(ComponentEventContext);
  };

  const withComponentEvent = <Props extends object = {}>(
    Component: React.ComponentType<Props>
  ) => {
    return (props: Props) => {
      const flowEventState = React.useRef(initialState);
      // why we use Any generic type here?
      // because component doesn't know who is the parent/page.
      // A shared component could be used for multiple biz pages.
      const pageEventContext = useInternalPageEventContext<any>();

      const trackEvent = <EventName extends keyof EventDefinition>(
        name: EventName,
        ...args: undefined extends EventDefinition[EventName]
          ? [details?: EventDefinition[EventName]]
          : [details: EventDefinition[EventName]]
      ) => {
        if (
          pageEventContext &&
          pageEventContext.trackSubTrackerEvent({
            trackerName: tracker.name,
            eventName: name,
            args,
            getState: () => Object.freeze({ ...flowEventState.current }),
            updateState: (upserts: Partial<FlowEventState>) => {
              flowEventState.current = {
                ...flowEventState.current,
                ...upserts,
              };
            },
          })
        ) {
          return true;
        }
        const handler = tracker.handlers[name];
        if (handler) {
          console.log(
            `[${tracker.name}] track event --> ${String(name)}     args:`,
            args
          );
          const ret = handler.apply(tracker, args);
          if (ret == null) {
            // no state change
          } else if (typeof ret === 'function') {
            // state change
            const nestedRet = ret({
              state: Object.freeze({ ...flowEventState.current }),
            });
            if (nestedRet && typeof nestedRet === 'object') {
              flowEventState.current = {
                ...flowEventState.current,
                ...nestedRet,
              };
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
