import React from "react";
import { EnhancedTableToolbar } from "../../components/EnhancedTableToolbar";
import { render } from "../../../../test-utils.test";
import "@testing-library/jest-dom";
import { theme } from "../../../../App";
import { ThemeProvider } from "@mui/material/styles";

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
  return render(
    <ThemeProvider theme={theme}>
      <EnhancedTableToolbar {...baseProps} {...props} />
    </ThemeProvider>
  );
}

describe("EnhancedTableToolbar", () => {
  it("should match snapshot", () => {
    const { container } = renderUI();

    expect(container).toMatchSnapshot();
  });
});
