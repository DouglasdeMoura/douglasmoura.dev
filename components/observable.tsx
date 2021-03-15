import { createContext, useState } from 'react';

const LocalContext = createContext({ setState: () => { } });

export function State({ children, initialState }) {
  const [localState, setLocalState] = useState(initialState);

  const setState = newState => {
    setLocalState({ ...getState(), ...newState });
  }

  const getState = () => ({ ...localState, setState });

  return (
    <LocalContext.Provider value={getState()}>
      {
        typeof children === 'function'
          ? children(getState())
          : children
      }
    </LocalContext.Provider>
  );
}

export function Observe({ children }) {
  return (
    <LocalContext.Consumer>
      {store => children(store)}
    </LocalContext.Consumer>
  );
}
