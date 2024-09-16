import * as React from 'react';

export const PageEventContext = (() => {
  let context = (window as any).__$pageEventContext;
  if (!context) {
    context = React.createContext({});
    (window as any).__$pageEventContext = context;
  }
  return context;
})();
