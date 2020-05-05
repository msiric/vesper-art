import React, { createContext, useContext, useReducer } from 'react';

const initialState = {
  main: {
    artwork: '',
    discount: '',
    step: 0,
  },
  formValues: {
    licenses: [{ licenseType: '', licenseeName: '', licenseeCompany: '' }],
    billing: {
      firstname: '',
      lastname: '',
      email: '',
      address: '',
      zip: '',
      city: '',
      country: '',
    },
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'editMainValue':
      state.main[action.key.toLowerCase()] = action.value;
      return { ...state };
    case 'editFormValue':
      state.formValues[action.key.toLowerCase()] = action.value;
      return { ...state };

    case 'emptyFormValue':
      return {
        ...state,
        formValues: initialState.formValues,
      };
    default:
  }
  return state;
};

const StateContext = createContext();

export const StateProvider = ({ children, definedState }) => (
  <StateContext.Provider
    value={useReducer(reducer, definedState ? definedState : initialState)}
  >
    {children}
  </StateContext.Provider>
);

export const useStateValue = () => useContext(StateContext);
