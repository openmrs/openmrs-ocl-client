import React from "react";
import { makeStyles, Tab, Tabs } from "@material-ui/core";
import { Link } from "react-router-dom";

interface Props {
  currentPageUrl: string;
}

const useStyles = makeStyles({
  fullWidth: {
    width: "100%"
  }
});

export const SourceOwnerTabs: React.FC<Props> = ({ currentPageUrl }) => {
  const classes = useStyles();

  return (
    <Tabs
      // centered
      className={classes.fullWidth}
      variant="fullWidth"
      value={currentPageUrl}
    >
      <LinkTab
        label="Your Sources"
        value="/user/sources/"
        to="/user/sources/"
      />
      <LinkTab
          label="Your Organizations' Sources"
          value="/user/orgs/sources/"
          to="/user/orgs/sources/"
      />
      <LinkTab
          label="Public Sources"
          value="/sources/"
          to="/sources/"
      />
    </Tabs>
  );
};

interface LinkTabProps {
  label: string;
  value: string;
  to: string;
}

function LinkTab(props: LinkTabProps) {
  return <Tab component={Link} {...props} />;
}
