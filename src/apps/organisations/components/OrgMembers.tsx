import React from "react";
import {Button, ButtonGroup, createStyles, Grid, List, makeStyles, Paper, Typography} from "@material-ui/core";
import { OrgMember } from "../types";
import {
    DeleteOutline as DeleteIcon
} from "@material-ui/icons";


interface Props {
    members: OrgMember[];
}
const useStyles = makeStyles((theme) =>
    createStyles({
        root:{
            width:'100%',
            display:"flex",
            justifyContent:"space-between"
        }
    }),
);
const OrganisationMembers: React.FC<Props> = ({ members }) => {
    const classes = useStyles();
  return (
    <Grid item xs={12} component="div">
      <Paper className='fieldsetParent'>
        <fieldset>
          <Typography component='legend' variant='h5' gutterBottom>
              Members
          </Typography>
            <List>
                <ul>
                    {members?.length ?
                        members.map(m =>
                            <li className={classes.root}
                                key={m.username}>{m.username || m.name}
                                <DeleteIcon/>
                            </li>) :
                        <li>No members found!</li>}
                </ul>
            </List>
            <ButtonGroup fullWidth variant='text' color='primary'>
                <Button>Add New Member</Button>
            </ButtonGroup>
        </fieldset>
      </Paper>
    </Grid>
  );
};

export default OrganisationMembers;
