import React from "react";
import store from "./redux";
import { render as rtlRender } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
function render(
  ui: any,
  { initialState = store.getState(), store: any = store, ...renderOptions } = {}
) {
  function Wrapper({ children }: any) {
    return (
      <Provider store={store}>
        <Router>{children}</Router>
      </Provider>
    );
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}
// re-export everything
export * from "@testing-library/react";
// override render method
export { render };
