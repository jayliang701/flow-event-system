import Emittery from 'emittery';

export const flowEventEmitter: Emittery = (() => {
  let context = (window as any).__$flowEventEmitter;
  if (!context) {
    context = new Emittery();
    (window as any).__$flowEventEmitter = context;
  }
  return context;
})();
