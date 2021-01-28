import React, { useState } from "react";
import { addOrgMemberAction } from "../redux";
import {Button, ButtonGroup, createStyles, Grid, List, makeStyles, Paper, Typography, Dialog} from "@material-ui/core";
import { OrgMember } from "../types";
import AddMemberForm from "./AddMemberForm";
import {
    DeleteOutline as DeleteIcon
} from "@material-ui/icons";


interface Props {
    members: OrgMember[];
    addMember: (
        ...args: Parameters<typeof addOrgMemberAction>
      ) => void;
    orgUrl: string;
};

const useStyles = makeStyles((theme) =>
    createStyles({
        root:{
            width:'100%',
            display:"flex",
            justifyContent:"space-between"
        }
    }),
);
const OrganisationMembers: React.FC<Props> = ({ members, orgUrl, addMember }) => {
    const [openDialog, setOpenDialog] = useState(false);
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
                <Button onClick={() => setOpenDialog(true)}>Add New Member</Button>
            </ButtonGroup>
            <Dialog onClose={() => setOpenDialog(false)} open={openDialog}>
               <AddMemberForm orgUrl={orgUrl} handleClose={() => setOpenDialog(false)} onSubmit={(values: OrgMember) => addMember(orgUrl, values)}/>
            </Dialog>
        </fieldset>
      </Paper>
    </Grid>
  );
};

export default OrganisationMembers;
