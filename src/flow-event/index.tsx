import * as React from 'react';
import { FlowEventContextValue, FlowEventTracker } from './types';

export * from './types';
export * from './utils';

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
  const context = PageEventContext as React.Context<
    FlowEventContextValue<EventDefinition>
  >;
  return context;
}

export function usePageEventContext<
  EventDefinition
>(): FlowEventContextValue<EventDefinition> {
  return React.useContext(PageEventContext);
}

export function withPageEvent<EventDefinition, Props extends object = {}>(
  tracker: FlowEventTracker<EventDefinition>
) {
  return (Component: React.ComponentType<Props>) => {
    return (props: Props) => {
      const trackEvent = <EventName extends keyof EventDefinition>(
        name: EventName,
        ...args: undefined extends EventDefinition[EventName]
          ? [details?: EventDefinition[EventName]]
          : [details: EventDefinition[EventName]]
      ) => {
        const handler = tracker.handlers[name];
        if (handler) {
          console.log(
            `[Page Event] handle event --> ${String(name)}     args: ${args}`
          );
          void handler.apply(tracker, args);
          return true;
        } else {
          return false;
        }
      };

      const trackSubTrackerEvent = (
        trackerName: string,
        eventName: string,
        ...payloads: any
      ) => {
        const subTracker = tracker.subTrackers
          ? (tracker.subTrackers as Record<string, FlowEventTracker<any>>)[
              trackerName
            ]
          : undefined;
        if (subTracker && subTracker.handlers[eventName]) {
          void subTracker.handlers[eventName].apply(subTracker, payloads);
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

export function createComponentEventContext<EventDefinition>(
  tracker: FlowEventTracker<EventDefinition>
) {
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
      const pageEventContext = usePageEventContext<EventDefinition>();

      const trackEvent = <EventName extends keyof EventDefinition>(
        name: EventName,
        ...args: undefined extends EventDefinition[EventName]
          ? [details?: EventDefinition[EventName]]
          : [details: EventDefinition[EventName]]
      ) => {
        if (
          pageEventContext &&
          (pageEventContext as any).trackSubTrackerEvent(
            tracker.name,
            name,
            ...args
          )
        ) {
          return true;
        }
        const handler = tracker.handlers[name];
        if (handler) {
          console.log(
            `[Component Event] handle event --> ${String(
              name
            )}     args: ${args}`
          );
          void handler.apply(tracker, args);
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
