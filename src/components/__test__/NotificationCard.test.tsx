import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import NotificationCard from "../NotificationCard";
import { BrowserRouter as Router } from "react-router-dom";

type notificationCardProps = React.ComponentProps<typeof NotificationCard>;

const baseProps: notificationCardProps = {
  headerMessage: "This is header message",
  subHeaderMessage: "This is sub-header message",
  importMetaData: {
    dictionary: "/users/root/collections/testBulk2/",
    dateTime: "Mon Sep 28 2020 09:24:36 GMT+0530",
  },
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
});
