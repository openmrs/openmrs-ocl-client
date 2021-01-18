import React from "react";
import { Grid, Paper, Typography, List } from "@material-ui/core";
import {OrgCollection} from "../types";

interface Props {
  collections: OrgCollection[];
}

const OrganisationDictionaries: React.FC<Props> = ({ collections }) => {
  return (
    <Grid item xs={12} component='div'>
      <Paper className='fieldsetParent'>
        <fieldset>
          <Typography component='legend' variant='h5' gutterBottom>
              Collections
          </Typography>
          <List>
            <ul>
            {collections?.length ? collections.map(c =>
            <li key={c.id}>{c.name}</li>):
            <p>No Collections found!</p>}
            </ul>
          </List>
        </fieldset>
      </Paper>
    </Grid>
  );
};
export default OrganisationDictionaries;
