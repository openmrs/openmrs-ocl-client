import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../../../redux";
import { BrowserRouter as Router } from "react-router-dom";
import * as React from "react";
import { EditMenu } from "../EditMenu";

type editMenuProps = React.ComponentProps<typeof EditMenu>;

const baseProps: editMenuProps = {
  backUrl: "url"
};
function renderUI(props: Partial<editMenuProps> = {}) {
  return render(
    <Provider store={store}>
      <Router>
        <EditMenu {...baseProps} {...props} />
      </Router>
    </Provider>
  );
}

describe("EditMenu", () => {
  it("EditMenu snapshot test", () => {
    const { container } = renderUI();
    expect(container).toMatchSnapshot();
  });
});
