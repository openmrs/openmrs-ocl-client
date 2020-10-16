import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import NotificationCard from "../../components/NotificationCard";
import { BrowserRouter as Router } from "react-router-dom";
import { NotificationItem, NotificationItemRow } from "../../types";

type notificationCardProps = React.ComponentProps<typeof NotificationCard>;

const notificationItemRow: NotificationItemRow ={
  expression: "",
  added: true,
  message: "1 notification added"
};
const notificationItem: NotificationItem = {
  result: [notificationItemRow],
  progress: ""
};

const openNotificationDetails = jest.fn();
const baseProps: notificationCardProps = {
  headerMessage: "This is header message",
  subHeaderMessage: "This is sub-header message",
  importMetaData: {
    dictionary: "/users/root/collections/testBulk2/",
    dateTime: "Mon Sep 28 2020 09:24:36 GMT+0530",
  }
};

function renderUI(props: Partial<notificationCardProps> = {}) {
  return render(
    <Router>
      <NotificationCard {...baseProps} {...props} />
    </Router>
  );
}

describe("NotificationCard", () => {
  it("NotificationCard snapshot test", () => {
    const { container } = renderUI();
    expect(container).toMatchSnapshot();
  });

  it("should not show view summary button if list is not succeslist", () => {
    const { queryByText } = renderUI();
    const viewSummaryLink = queryByText('View Summary');
    expect(viewSummaryLink).toBeNull(); 
  });

  it("should call openNotificationDetails on click of view summary button", () => {
    const { getByText } = renderUI({
      notification: notificationItem,
      openNotificationDetails: openNotificationDetails
    });
    const viewSummaryLink = getByText('View Summary');
    fireEvent.click(viewSummaryLink);
    expect(openNotificationDetails).toHaveBeenCalledTimes(1)
  });
});
