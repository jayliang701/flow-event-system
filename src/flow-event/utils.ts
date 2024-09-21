import { FlowEventHandlers, FlowEventTracker } from './types';

export function createFlowEventTracker<ContextValueType extends object = {}>(
  name: string,
  {
    context,
    handlerCreator,
    subTrackers,
  }: {
    context: ContextValueType;
    handlerCreator: (
      context: ContextValueType,
      setContext: (newContext: ContextValueType) => ContextValueType
    ) => FlowEventHandlers<any>;
    subTrackers: Record<string, FlowEventTracker<any>>;
  }
) {
  return {
    name,
    subTrackers,
    handlers: (() => {
      const runtimeContext = { ...context }; // deep copy
      const setContext = (newContext: ContextValueType) => {
        for (const key in newContext) {
          runtimeContext[key] = newContext[key];
        }
        return runtimeContext;
      };

      return handlerCreator(runtimeContext, setContext);
    })(),
  };
}
