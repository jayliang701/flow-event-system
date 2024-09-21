export type FlowEventTracker<
  EventDefinition,
  SubTrackers extends Record<string, FlowEventTracker<any>> = {}
> = {
  name: string;
  subTrackers: SubTrackers;
  handlers: FlowEventHandlers<EventDefinition>;
};

export type FlowEventHandlers<EventDefinition> = {
  [EventName in keyof EventDefinition]: (
    ...args: undefined extends EventDefinition[EventName]
      ? [details?: EventDefinition[EventName]]
      : [details: EventDefinition[EventName]]
  ) => void;
};

export type FlowEventContextValue<EventDefinition> = {
  trackEvent<EventName extends keyof EventDefinition>(
    name: EventName,
    ...args: undefined extends EventDefinition[EventName]
      ? [details?: EventDefinition[EventName]]
      : [details: EventDefinition[EventName]]
  ): boolean;
};

export type ToEventDefinition<
  Method extends (...args: any[]) => {
    [name: string]: (details?: any) => void;
  }
> = {
  [EventName in keyof ReturnType<Method>]: [] extends Parameters<
    ReturnType<Method>[EventName]
  >
    ? undefined
    : Parameters<ReturnType<Method>[EventName]>[0];
};
