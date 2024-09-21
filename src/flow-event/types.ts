export type FlowEventTracker<EventDefinition> = {
  name: string;
  handlers: FlowEventHandlers<EventDefinition>;
};

export type PageFlowEventTracker<EventDefinition> = FlowEventTracker<EventDefinition> & {
  subTrackers?: Record<string, { handlers: FlowEventHandlers<any> }>;
};

export type FlowEventHandlers<EventDefinition, FlowEventState extends object = {}> = {
  [EventName in keyof EventDefinition]: (
    ...args: undefined extends EventDefinition[EventName]
      ? [details?: EventDefinition[EventName]]
      : [details: EventDefinition[EventName]]
  ) =>
    | void
    | Partial<FlowEventState>
    | ((context: { state: Readonly<FlowEventState> }) => void | Partial<FlowEventState>);
};

export type FlowEventContextValue<EventDefinition> = {
  trackEvent<EventName extends keyof EventDefinition>(
    name: EventName,
    ...args: undefined extends EventDefinition[EventName]
      ? [details?: EventDefinition[EventName]]
      : [details: EventDefinition[EventName]]
  ): boolean;
};
