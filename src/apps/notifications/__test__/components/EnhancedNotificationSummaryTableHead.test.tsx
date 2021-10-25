import React from "react";
import { Table } from "@mui/material";
import { render } from "@testing-library/react";
import { EnhancedNotificationSummaryTableHead } from "../../components/EnhancedNotificationSummaryTableHead";

type enhancedNotificationSummaryTableHeadProps = React.ComponentProps<
  typeof EnhancedNotificationSummaryTableHead
>;
const baseProps: enhancedNotificationSummaryTableHeadProps = {
  order: "asc",
  orderBy: "status",
  onRequestSort: jest.fn
};

function renderUI(
  props: Partial<enhancedNotificationSummaryTableHeadProps> = {}
) {
  return render(
    <Table>
      <EnhancedNotificationSummaryTableHead {...baseProps} {...props} />
    </Table>
  );
}

describe("EnhancedNotificationSummaryTableHead", () => {
  it("match snapshot", () => {
    const { container } = renderUI();
    expect(container).toMatchSnapshot();
  });
});
