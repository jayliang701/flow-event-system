export type FlowEventTracker<
  EventDefinition,
  FlowEventState extends object = {}
> = {
  name: string;
  handlers: FlowEventHandlers<EventDefinition, FlowEventState>;
};

export type PageFlowEventTracker<
  EventDefinition,
  FlowEventState extends object = {}
> = FlowEventTracker<EventDefinition> & {
  subTrackers?: Record<
    string,
    { handlers: SubFlowEventHandlers<any, any, FlowEventState> }
  >;
};

export type FlowEventHandlers<
  EventDefinition,
  FlowEventState extends object = {}
> = {
  [EventName in keyof EventDefinition]: (
    ...args: undefined extends EventDefinition[EventName]
      ? [details?: EventDefinition[EventName]]
      : [details: EventDefinition[EventName]]
  ) =>
    | void
    | Partial<FlowEventState>
    | ((context: {
        state: Readonly<FlowEventState>;
      }) => void | Partial<FlowEventState>);
};

type ExtractEventDefinition<P> = P extends FlowEventHandlers<infer T, any>
  ? T
  : never;
type ExtractFlowEventState<P> = P extends FlowEventHandlers<any, infer T>
  ? T
  : never;

export type ToSubFlowEventHandlers<
  FlowEventHandlers,
  PageFlowEventState extends object = {},
  EventDefinition = ExtractEventDefinition<FlowEventHandlers>,
  FlowEventState extends object = ExtractFlowEventState<FlowEventHandlers>
> = SubFlowEventHandlers<EventDefinition, FlowEventState, PageFlowEventState>;

export type SubFlowEventHandlers<
  EventDefinition,
  FlowEventState extends object = {},
  PageFlowEventState extends object = {}
> = {
  [EventName in keyof EventDefinition]: (
    ...args: undefined extends EventDefinition[EventName]
      ? [details?: EventDefinition[EventName]]
      : [details: EventDefinition[EventName]]
  ) =>
    | void
    | Partial<FlowEventState>
    | ((context: {
        state: Readonly<FlowEventState>;
        pageState: Readonly<PageFlowEventState>;
      }) => void | Partial<FlowEventState>);
};

export type FlowEventContextValue<EventDefinition> = {
  trackEvent<EventName extends keyof EventDefinition>(
    name: EventName,
    ...args: undefined extends EventDefinition[EventName]
      ? [details?: EventDefinition[EventName]]
      : [details: EventDefinition[EventName]]
  ): boolean;
};

// This is the Page level context value.
// For feature codes, we only expose `trackEvent` function to fire event.
// `trackSubTrackerEvent` function is protected and only be used inside Component Flow Event Context HoC
export type InternalPageFlowEventContextValue<EventDefinition> =
  FlowEventContextValue<EventDefinition> & {
    trackSubTrackerEvent<
      ComponentEventDefinition,
      ComponentEventName extends keyof ComponentEventDefinition,
      ComponentFlowEventState extends object = {}
    >(params: {
      trackerName: string;
      eventName: ComponentEventName;
      args: undefined extends ComponentEventDefinition[ComponentEventName]
        ? [details?: ComponentEventDefinition[ComponentEventName]]
        : [details: ComponentEventDefinition[ComponentEventName]];
      getState: () => ComponentFlowEventState;
      updateState: (state: Partial<ComponentFlowEventState>) => void;
    }): boolean;
  };
