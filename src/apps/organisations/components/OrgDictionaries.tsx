import React from "react";
import { Grid, Paper, Typography, List } from "@material-ui/core";
import {OrgCollection} from "../types";
import { Link } from "react-router-dom";

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
            {collections?.length ?
              collections.map(c => <li key={c.id}><Link to={c.url}>{c.name}</Link></li>) :
              <li>No dictionaries found!</li>}
            </ul>
          </List>
        </fieldset>
      </Paper>
    </Grid>
  );
};

export default OrganisationDictionaries;
