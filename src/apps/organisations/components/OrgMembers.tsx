import React from "react";
import { Grid, Paper, Typography } from "@material-ui/core";

const OrganisationMembers: React.FC = () => {
  return (
    <Grid item xs={12} component="div">
      <Paper className='fieldsetParent'>
        <fieldset>
          <Typography component='legend' variant='h5' gutterBottom>
              Members
          </Typography>
          Members go here, To be done by <b>Suruchi</b>
        </fieldset>
      </Paper>
    </Grid>
  );
};

export default OrganisationMembers;