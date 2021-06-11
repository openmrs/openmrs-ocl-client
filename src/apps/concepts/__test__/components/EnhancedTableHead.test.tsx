import React from "react";
import { EnhancedTableHead } from "../../components/EnhancedTableHead";
import { render } from "../../../../test-utils.test";
import "@testing-library/jest-dom";
import Table from "@material-ui/core/Table";

type enhancedTableHeadProps = React.ComponentProps<typeof EnhancedTableHead>;
const baseProps: enhancedTableHeadProps = {
  classes: {
    paper: "makeStyles-paper-89",
    root: "makeStyles-root-88",
    table: "makeStyles-table-90",
    tableWrapper: "makeStyles-tableWrapper-91",
    visuallyHidden: "makeStyles-visuallyHidden-92"
  },
  numSelected: 0,
  order: "sortAsc",
  orderBy: "id",
  onSelectAllClick: function() {},
  onRequestSort: function() {},
  rowCount: 10
};

function renderUI(props: Partial<enhancedTableHeadProps> = {}) {
  return render(
    <Table>
      <EnhancedTableHead {...baseProps} {...props} />
    </Table>
  );
}

describe("EnhancedTableHead", () => {
  it("should match snapshot", () => {
    const { container } = renderUI();

    expect(container).toMatchSnapshot();
  });
});
