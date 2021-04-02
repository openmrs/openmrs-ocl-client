import React from "react";
import { EnhancedTableToolbar } from "../../components/EnhancedTableToolbar";
import { render } from "../../../../test-utils";
import "@testing-library/jest-dom";

type enhancedTableToolbarProps = React.ComponentProps<
  typeof EnhancedTableToolbar
>;
const baseProps: enhancedTableToolbarProps = {
  numSelected: 0,
  q: "",
  search: function() {},
  setQ: function() {},
  toggleShowOptions: function() {},
  showAddConcepts: false,
  addSelectedConcepts: function() {}
};

function renderUI(props: Partial<enhancedTableToolbarProps> = {}) {
  return render(<EnhancedTableToolbar {...baseProps} {...props} />);
}

describe("EnhancedTableToolbar", () => {
  it("should match snapshot", () => {
    const { container } = renderUI();

    expect(container).toMatchSnapshot();
  });
});
