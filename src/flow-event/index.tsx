import * as React from 'react';
import { EventContextValue, FlowTracker } from './types';

// Page Level
const PageEventContext: React.Context<EventContextValue<any>> = (() => {
  let context = (window as any).__$pageEventContext;
  if (!context) {
    context = React.createContext<EventContextValue<any>>({
      trackEvent: () => false,
    });
    (window as any).__$pageEventContext = context;
  }
  return context;
})();

export function usePageEventContext() {
  return React.useContext(PageEventContext);
}

export function withPageEvent<EventDefinition, Props extends object = {}>(
  tracker: FlowTracker<EventDefinition>,
) {
  return (Component: React.ComponentType<Props>) => {
    return (props: Props) => {
      const trackEvent = <EventName extends keyof EventDefinition>(
        name: EventName,
        ...args: undefined extends EventDefinition[EventName]
          ? [details?: EventDefinition[EventName]]
          : [details: EventDefinition[EventName]]
      ) => {
        const handler = tracker[name];
        if (handler) {
          void handler.apply(tracker, args);
          return true;
        } else {
          return false;
        }
      };

      const RootEventContext = PageEventContext as React.Context<
        EventContextValue<EventDefinition>
      >;
      return (
        <RootEventContext.Provider
          value={{
            trackEvent,
          }}
        >
          <Component {...props} />
        </RootEventContext.Provider>
      );
    };
  };
}

export function createComponentEventContext<EventDefinition>(
  tracker: FlowTracker<EventDefinition>,
) {
  const ComponentEventContext = React.createContext<EventContextValue<EventDefinition>>({
    trackEvent: () => false,
  });

  const useComponentEventContext = () => {
    return React.useContext(ComponentEventContext);
  };

  const withComponentEvent = <Props extends object = {}>(Component: React.ComponentType<Props>) => {
    return (props: Props) => {
      const pageEventContext = usePageEventContext();

      const trackEvent = <EventName extends keyof EventDefinition>(
        name: EventName,
        ...args: undefined extends EventDefinition[EventName]
          ? [details?: EventDefinition[EventName]]
          : [details: EventDefinition[EventName]]
      ) => {
        if (pageEventContext && pageEventContext.trackEvent(name, ...args)) {
          return true;
        }
        const handler = tracker[name];
        if (handler) {
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
