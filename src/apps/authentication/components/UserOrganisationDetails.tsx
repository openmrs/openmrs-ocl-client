import React from "react";
import { Paper, Typography } from "@mui/material";
import { makeStyles } from '@mui/styles';
import { APIOrg } from "../types";
import List from "@mui/material/List";
import { Link } from "react-router-dom";
interface Props {
  orgs?: APIOrg[];
}

const useStyles = makeStyles({
  container: {
    minWidth: "0"
  },
  orgList: {
    maxHeight: 280,
    overflow: "scroll",
    color: "black"
  },
  orgItem: {
    paddingBottom: "12px"
  }
});

const UserOrganisationDetails: React.FC<Props> = ({ orgs }) => {
  const classes = useStyles();

  const getUserOrganisationsList = () => {
    const OrganisationsList: Array<JSX.Element> = orgs
      ? [...orgs]
          .sort((a, b) =>
            a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase())
          )
          .map(org => (
            <li key={org.id} className={classes.orgItem}>
              <Link to={org.url}>{org.name}</Link>
            </li>
          ))
      : [];
    return OrganisationsList;
  };

  const getUserOrgsEmptyMessage = () => {
    if (orgs && orgs.length === 0) {
      return (
        <Typography data-testid="noUserOrgsMessage" align="center">
          You're not part of any Organisation
        </Typography>
      );
    }
    return null;
  };

  return (
    <Paper className="fieldsetParent">
      <fieldset className={classes.container}>
        <Typography component="legend" variant="h5" gutterBottom>
          Your Organisations
        </Typography>
        {getUserOrgsEmptyMessage()}
        <List className={classes.orgList}>
          <ul>{getUserOrganisationsList()}</ul>
        </List>
      </fieldset>
    </Paper>
  );
};

export default UserOrganisationDetails;
