import React, { useState, useEffect } from "react";
import { addOrgMemberAction, deleteOrgMemberAction } from "../redux";
import {
    Button, 
    ButtonGroup, 
    createStyles, 
    Grid, 
    List, 
    makeStyles, 
    Paper, 
    Typography, 
    Dialog,
    Collapse,
    IconButton
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { OrgMember } from "../types";
import AddMemberForm from "./AddMemberForm";
import {
    DeleteOutline as DeleteIcon,
    CloseOutlined
} from "@material-ui/icons";
import {ConfirmationDialog} from "../../../utils";


interface Props {
    members: OrgMember[];
    addError?: string;
    loading: boolean;
    addMember: (
        ...args: Parameters<typeof addOrgMemberAction>
      ) => void;
    orgUrl: string;
    confirmDelete?: () => void;
    deleteMember: (
        ...args: Parameters<typeof deleteOrgMemberAction>
    ) => void;
    deleteError?:string,
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
const confirmationMsg = () => {
    return (
        <div>
            <h5 id="modal-title">
                Delete
            </h5>
            <p id="delete-modal-description">
                Are you sure you want to Delete? This could mean that you loose members data within this organisation.
            </p>
        </div>
    );
};
const OrganisationMembers: React.FC<Props> = ({ members, orgUrl, addMember, loading, addError, deleteMember ,deleteError}) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [openDialogDelete, setOpenDialogDelete] = useState(false);
    const confirmDelete=() => {setOpenDialogDelete(true)}
    const classes = useStyles();


    useEffect(() => {
        if (addError || deleteError) {
            setOpenAlert(true);
        };
    }, [addError, deleteError]);
    return (
    <Grid item xs={12} component="div">
      <Paper className='fieldsetParent'>
        <fieldset>
          <Typography component='legend' variant='h5' gutterBottom>
              Members
          </Typography>
          <Collapse in={openAlert}>
            <Alert
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => setOpenAlert(false)}>
                  <CloseOutlined fontSize="inherit" />
                </IconButton>
              }
            >
              {(addError &&`Adding: ${addError}`) || (deleteError && `Deleting: ${deleteError}`)}
            </Alert>
          </Collapse>
            <List>
                <ul>
                    {members?.length ?
                        members.map(m =>
                            <li className={classes.root} key={m.username}>{m.username || m.name}
                                <IconButton onClick={confirmDelete} ><DeleteIcon /></IconButton>
                                <ConfirmationDialog
                                    open={openDialogDelete}
                                    setOpen={() => setOpenDialogDelete(!openDialogDelete)}
                                    onConfirm={() =>
                                    {
                                        deleteMember(orgUrl, m.username);
                                        setOpenDialogDelete(!openDialogDelete);
                                    }}
                                    message={confirmationMsg()}
                                    cancelButtonText={"No"}
                                    confirmButtonText={"Yes"}
                                />
                            </li>) :
                        <li>No members found!</li>}
                </ul>
            </List>
            <ButtonGroup fullWidth variant='text' color='primary'>
                <Button onClick={() => setOpenDialog(true)}>Add New Member</Button>
            </ButtonGroup>
            <Dialog onClose={() => setOpenDialog(false)} open={openDialog}>
               <AddMemberForm 
                    orgUrl={orgUrl} 
                    handleClose={() => setOpenDialog(false)} 
                    onSubmit={(values: OrgMember) => addMember(orgUrl, values)} 
                    loading={loading} 
                    error={addError}/>
            </Dialog>
        </fieldset>
      </Paper>
    </Grid>
  );
};

export default OrganisationMembers;
