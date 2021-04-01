import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import NotificationDetails from "../../components/NotificationDetails";
import { NotificationItem, NotificationItemRow } from "../../types";

type notificationDetailsProps = React.ComponentProps<
  typeof NotificationDetails
>;

const notificationItemRow: NotificationItemRow = {
  expression: "/orgs/testOrg/sources/testSource/concepts/testConceptID/",
  added: true,
  message: "concept imported successfully"
};
const notificationItem: NotificationItem = {
  result: [notificationItemRow],
  progress: "",
  meta: ["/users/testUser/collections/testDictionary/"]
};

const handleClose = jest.fn();
const baseProps: notificationDetailsProps = {
  open: true,
  handleClose: handleClose,
  notification: notificationItem
};

function renderUI(props: Partial<notificationDetailsProps> = {}) {
  return render(<NotificationDetails {...baseProps} {...props} />);
}

describe("NotificationDetails", () => {
  it("should show the correct title", () => {
    const { queryByTestId } = renderUI();
    const title = queryByTestId("title") || { textContent: null };

    expect(title.textContent).toBe(
      "testDictionary - Adding concepts from testSource"
    );
  });

  it("should hide dialog on click of close button", () => {
    const { getByText } = renderUI();
    const closeButton = getByText("Close");
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

describe("Notification Summary Table Header", () => {
  let enhancedTableHeadRowData:
    | NodeListOf<HTMLTableHeaderCellElement>
    | never[];
  beforeEach(() => {
    const queries = renderUI();
    const queryByTestId = queries.queryByTestId;
    const enhancedTableHeadRow = queryByTestId("enhancedTableHead");
    enhancedTableHeadRowData = enhancedTableHeadRow
      ? enhancedTableHeadRow.querySelectorAll("th")
      : [];
  });

  it("should have 5 columns in table header", () => {
    expect(enhancedTableHeadRowData.length).toEqual(5);
  });

  it("should have the correct table header for S.No", () => {
    expect(enhancedTableHeadRowData[0].textContent).toBe("S.No");
  });

  it("should have the correct table header for Concept ID", () => {
    expect(enhancedTableHeadRowData[1].textContent).toBe("Concept ID");
  });

  it("should have the correct table header for Concept Type", () => {
    expect(enhancedTableHeadRowData[2].textContent).toBe("Concept Type");
  });

  it("should have the correct table header for Status", () => {
    expect(enhancedTableHeadRowData[3].textContent).toBe(
      "Statussorted descending"
    );
  });

  it("should have the correct table header for Reasons", () => {
    expect(enhancedTableHeadRowData[4].textContent).toBe("Reasons");
  });
});

describe("Notification Summary Table data", () => {
  const notificationItemRow1: NotificationItemRow = {
    expression: "/orgs/testOrg/sources/testSource/concepts/testConceptID1/",
    added: true,
    message: "concept imported successfully"
  };
  const notificationItemRow2: NotificationItemRow = {
    expression: "/orgs/testOrg/sources/testSource/concepts/testConceptID2/",
    added: false,
    message: "concept import failed due to conflicts"
  };
  const notificationItemRow3: NotificationItemRow = {
    expression:
      "/orgs/testOrg/sources/testSource/concepts/testDependentConceptID1/",
    added: true,
    message: "concept imported successfully"
  };
  const notificationItemRow4: NotificationItemRow = {
    expression:
      "/orgs/testOrg/sources/testSource/concepts/testDependentConceptID2/",
    added: false,
    message: "concept import failed due to conflicts"
  };

  const notificationItem: NotificationItem = {
    result: [
      notificationItemRow1,
      notificationItemRow2,
      notificationItemRow3,
      notificationItemRow4
    ],
    progress: "",
    meta: [
      "/users/testUser/collections/testDictionary/",
      [{ id: "testConceptID1" }, { id: "testConceptID2" }]
    ]
  };

  let queryByTestId: Function;
  beforeEach(() => {
    const queries = renderUI({
      notification: notificationItem
    });
    queryByTestId = queries.queryByTestId;
  });

  describe("Notification Summary Table data - Parent Concept Imported", () => {
    let tableRowData: NodeListOf<HTMLElement>;
    beforeEach(() => {
      const tableRow = queryByTestId("testConceptID1");
      tableRowData = tableRow ? tableRow.querySelectorAll("td") : [];
    });

    it("should have 5 columns in a row", () => {
      expect(tableRowData.length).toEqual(5);
    });

    it("should have the correct data for Concept ID", () => {
      expect(tableRowData[1].textContent).toBe("testConceptID1");
    });

    it("should have the correct data for Concept Type", () => {
      expect(tableRowData[2].textContent).toBe("Parent");
    });

    it("should have the correct data for Status", () => {
      expect(tableRowData[3].textContent).toBe("Imported");
    });

    it("should have the correct data for Reasons", () => {
      expect(tableRowData[4].textContent).toBe("concept imported successfully");
    });
  });

  describe("Notification Summary Table data - Parent Concept Skipped", () => {
    let tableRowData: NodeListOf<HTMLElement>;
    beforeEach(() => {
      const tableRow = queryByTestId("testConceptID2");
      tableRowData = tableRow ? tableRow.querySelectorAll("td") : [];
    });

    it("should have 5 columns in a row", () => {
      expect(tableRowData.length).toEqual(5);
    });

    it("should have the correct data for Concept ID", () => {
      expect(tableRowData[1].textContent).toBe("testConceptID2");
    });

    it("should have the correct data for Concept Type", () => {
      expect(tableRowData[2].textContent).toBe("Parent");
    });

    it("should have the correct data for Status", () => {
      expect(tableRowData[3].textContent).toBe("Skipped");
    });

    it("should have the correct data for Reasons", () => {
      expect(tableRowData[4].textContent).toBe(
        "concept import failed due to conflicts"
      );
    });
  });

  describe("Notification Summary Table data - Dependent Concept Imported", () => {
    let tableRowData: NodeListOf<HTMLElement>;
    beforeEach(() => {
      const tableRow = queryByTestId("testDependentConceptID1");
      tableRowData = tableRow ? tableRow.querySelectorAll("td") : [];
    });

    it("should have 5 columns in a row", () => {
      expect(tableRowData.length).toEqual(5);
    });

    it("should have the correct data for Concept ID", () => {
      expect(tableRowData[1].textContent).toBe("testDependentConceptID1");
    });

    it("should have the correct data for Concept Type", () => {
      expect(tableRowData[2].textContent).toBe("Dependent");
    });

    it("should have the correct data for Status", () => {
      expect(tableRowData[3].textContent).toBe("Imported");
    });

    it("should have the correct data for Reasons", () => {
      expect(tableRowData[4].textContent).toBe("concept imported successfully");
    });
  });

  describe("Notification Summary Table data - Dependent Concept Skipped", () => {
    let tableRowData: NodeListOf<HTMLElement>;
    beforeEach(() => {
      const tableRow = queryByTestId("testDependentConceptID2");
      tableRowData = tableRow ? tableRow.querySelectorAll("td") : [];
    });

    it("should have 5 columns in a row", () => {
      expect(tableRowData.length).toEqual(5);
    });

    it("should have the correct data for Concept ID", () => {
      expect(tableRowData[1].textContent).toBe("testDependentConceptID2");
    });

    it("should have the correct data for Concept Type", () => {
      expect(tableRowData[2].textContent).toBe("Dependent");
    });

    it("should have the correct data for Status", () => {
      expect(tableRowData[3].textContent).toBe("Skipped");
    });

    it("should have the correct data for Reasons", () => {
      expect(tableRowData[4].textContent).toBe(
        "concept import failed due to conflicts"
      );
    });
  });
});
