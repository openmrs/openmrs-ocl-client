import React from 'react';
import {Typography, List, Paper, ListItem, Grid, makeStyles} from "@material-ui/core";
import {APIOrganisation} from "../types";
interface Props {
  organisation: APIOrganisation;
}

const useStyles = makeStyles(() => ({
  listItem:{
    display: 'flex',
  },
  name: {
    marginRight: '1rem'
  }
}));

const OrganisationDetails: React.FC<Props> = ({ organisation }:Props) => {
  const {website, location, company, public_access} = organisation;
  const classes = useStyles();
  return (
    <Grid item xs={12} component='div'>
    <Paper className='fieldsetParent'>
      <fieldset>
        <Typography component='legend' variant='h5' gutterBottom>
          Details
        </Typography>

        <List>
          <ListItem className={classes.listItem}><strong className={classes.name}>Company</strong><span>{company}</span></ListItem>
          <ListItem className={classes.listItem}><strong className={classes.name}>Website</strong> <span>{website}</span></ListItem>
          <ListItem className={classes.listItem}><strong className={classes.name}>Location</strong> <span>{location}</span></ListItem>
          <ListItem className={classes.listItem}><strong className={classes.name}>Public Access</strong> <span>{public_access}</span></ListItem>
        </List>
      </fieldset>
    </Paper>
  </Grid>
  )
};

export default OrganisationDetails;
