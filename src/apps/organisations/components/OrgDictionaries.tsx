import React from "react";
import { Grid, Paper, Typography, List, ListItem } from "@material-ui/core";
import { OrgCollection } from "../types";
import { Link } from "react-router-dom";

interface Props {
  collections?: OrgCollection[];
}

const OrganisationDictionaries: React.FC<Props> = ({ collections }) => {
  return (
    <Grid item xs={12} component="div">
      <Paper className="fieldsetParent">
        <fieldset>
          <Typography component="legend" variant="h5" gutterBottom>
            Dictionaries
          </Typography>
          <List>
            {collections?.length ? (
              collections.map(c => (
                <ListItem key={c.id}>
                  <Link to={c.url}>{c.name}</Link>
                </ListItem>
              ))
            ) : (
              <ListItem>No dictionaries found!</ListItem>
            )}
          </List>
        </fieldset>
      </Paper>
    </Grid>
  );
};

export default OrganisationDictionaries;
