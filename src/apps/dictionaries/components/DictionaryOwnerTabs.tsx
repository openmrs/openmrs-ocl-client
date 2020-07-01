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

export const DictionaryOwnerTabs: React.FC<Props> = ({ currentPageUrl }) => {
  const classes = useStyles();

  return (
    <Tabs
      // centered
      className={classes.fullWidth}
      variant="fullWidth"
      value={currentPageUrl}
    >
      <LinkTab
        label="Public Dictionaries"
        value="/collections/"
        to="/collections/"
      />
      <LinkTab
        label="Your Dictionaries"
        value="/user/collections/"
        to="/user/collections/"
      />
      <LinkTab
        label="Your Organizations' Dictionaries"
        value="/user/orgs/collections/"
        to="/user/orgs/collections/"
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
