import React from "react";
import { Tab, Tabs } from "@mui/material";
import { Link } from "react-router-dom";
import { TabType } from "../types";
import { makeStyles } from "@mui/styles";

interface Props {
  currentPageUrl: string;
  tabList: TabType[];
}

const useStyles = makeStyles({
  fullWidth: {
    width: "100%",
    color: "black"
  }
});

const ContainerOwnerTabs: React.FC<Props> = ({ currentPageUrl, tabList }) => {
  const classes = useStyles();

  return (
    <Tabs
      // centered
      className={classes.fullWidth}
      indicatorColor="secondary"
      variant="fullWidth"
      value={currentPageUrl}
      data-testid="tabs"
    >
      {tabList.map(({ labelName, labelURL }, index) => (
        <LinkTab
          key={index}
          label={labelName}
          value={labelURL}
          to={labelURL}
          data-testid={"tab - " + index}
        />
      ))}
      ;
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

export default ContainerOwnerTabs;
