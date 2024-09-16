import * as React from "react";
import { FlowTrackingContextState, FlowTracker } from "./types";

export function withFlowTracking<EventDefinition>(
  Context: React.Context<FlowTrackingContextState<EventDefinition>>,
  createTracker: () =>
    | FlowTracker<EventDefinition>
    | Promise<FlowTracker<EventDefinition>>,
) {
  let isLoading = false;
  let tracker: FlowTracker<EventDefinition> | null = null;

  type PendingEvent<
    EventDefinition,
    EventName extends keyof EventDefinition = keyof EventDefinition,
  > = [
    EventName,
    undefined extends EventDefinition[EventName]
      ? [details?: EventDefinition[EventName]]
      : [details: EventDefinition[EventName]],
  ];

  const pendingEvents: Array<PendingEvent<EventDefinition>> = [];

  return function <T extends object>(Component: React.ComponentType<T>) {
    const flushPendingEvents = () => {
      pendingEvents.forEach(([name, args]) => {
        const handler = tracker ? tracker[name] : undefined;
        handler && handler.apply(tracker, args);
      });
      pendingEvents.length = 0;
    };

    const initTracker = async () => {
      if (isLoading || !!tracker) return;
      isLoading = true;
      tracker = await createTracker();
      flushPendingEvents();
    };

    function Wrapper(props: T) {
      const onFlowEvent = function <EventName extends keyof EventDefinition>(
        name: EventName,
        ...args: undefined extends EventDefinition[EventName]
          ? [details?: EventDefinition[EventName]]
          : [details: EventDefinition[EventName]]
      ) {
        if (tracker) {
          const handler = tracker[name];
          handler && handler.apply(tracker, args);
        } else {
          // @ts-ignore we know `args` is an array
          pendingEvents.push([name, args]);
        }
      };

      React.useEffect(() => {
        requestIdleCallback(() => {
          initTracker();
        });
      }, []);

      return (
        <Context.Provider value={{ onFlowEvent }}>
          <Component {...props} />
        </Context.Provider>
      );
    }
    return Wrapper;
  };
}
