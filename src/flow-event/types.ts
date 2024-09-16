export type FlowTracker<EventDefinition> = {
  [EventName in keyof EventDefinition]: (
    ...args: undefined extends EventDefinition[EventName]
      ? [details?: EventDefinition[EventName]]
      : [details: EventDefinition[EventName]]
  ) => void;
};

export type FlowTrackingContextState<EventDefinition> = {
  onFlowEvent<EventName extends keyof EventDefinition>(
    name: EventName,
    ...args: undefined extends EventDefinition[EventName]
      ? [details?: EventDefinition[EventName]]
      : [details: EventDefinition[EventName]]
  ): void;
};

export type ToEventDefinition<
  Method extends (...args: any[]) => {
    [name: string]: (details?: any) => void;
  },
> = {
  [EventName in keyof ReturnType<Method>]: [] extends Parameters<ReturnType<Method>[EventName]>
    ? undefined
    : Parameters<ReturnType<Method>[EventName]>[0];
};

export type EventContextValue<EventDefinition> = {
  trackEvent<EventName extends keyof EventDefinition>(
    name: EventName,
    ...args: undefined extends EventDefinition[EventName]
      ? [details?: EventDefinition[EventName]]
      : [details: EventDefinition[EventName]]
  ): boolean;
};
