import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import {
    Button,
    ButtonGroup,
    Dialog,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    Switch,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import {APIDictionaryVersion, DictionaryVersion} from "../types";
import DictionaryVersionForm from "./DictionaryVersionForm";
import { BASE_URL } from "../../../utils";
import ConfirmationDialog from "../../../utils/components/ConfirmationDialog";

interface Props {
  versions: APIDictionaryVersion[];
  showCreateVersionButton: boolean;
  createDictionaryVersion: Function;
  editDictionaryVersion: Function;
  createVersionLoading: boolean;
  createVersionError?: { detail: string };
  dictionaryUrl: string;
}

const ReleasedVersions: React.FC<Props> = ({
  versions,
  showCreateVersionButton,
  createDictionaryVersion,
  editDictionaryVersion,
  createVersionLoading,
  createVersionError,
  dictionaryUrl
}) => {
  const versionsToDisplay = versions.filter(row => row.id !== "HEAD");

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleReleaseVersionChange = () => {
     editDictionaryVersion({id:dictionaryVersion.id, released: !dictionaryVersion.released});
     setConfirmDialogOpen(false);
  };

  const openDialog = (row: APIDictionaryVersion) => {
      setConfirmDialogOpen(true);
      setDictionaryVersion(row);
  };

  const confirmationMsg = () => {
      return(
          <div >
              <span>Are you sure to mark version </span>
              <span style={{fontWeight: 'bold'}}>
                    {dictionaryVersion.id}
              </span> as {dictionaryVersion.released ? <span style={{color: '#f50057'}}>unreleased</span> :

              <span style={{color: '#f50057'}}>released</span>}?
          </div>
      )
  };

  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);

  const [dictionaryVersion, setDictionaryVersion] = React.useState<DictionaryVersion>(
    {
        id: "",
        released: false,
        description: "",
        external_id: ""
    });

    return (
    <Paper className="fieldsetParent">
      <fieldset style={{minWidth: "0"}}>
        <Typography component="legend" variant="h5" gutterBottom>
          Releases
        </Typography>
        {versionsToDisplay.length > 0 ? (
          <div>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Concepts</TableCell>
                  <TableCell>Subscription URL</TableCell>
                  <TableCell>Release Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {versionsToDisplay.map((row: APIDictionaryVersion) => (
                  <TableRow key={row.id}>
                    <TableCell  style={{wordBreak: 'break-all'}}>{row.id}</TableCell>
                    <TableCell style={{wordBreak: 'break-all'}}>{row.description || "None"}</TableCell>
                    <TableCell>
                      <Button
                        // not row.url because the response immediately after creating a new version is missing the url attribute for some reason
                        to={`${dictionaryUrl}${row.id}/concepts/`}
                        component={Link}
                        size="small"
                        variant="text"
                        color="primary"
                      >
                        View
                      </Button>
                    </TableCell>
                    <TableCell>
                      <CopyToClipboard text={`${BASE_URL}${dictionaryUrl}${row.id}/`}>
                        <Tooltip title={`${BASE_URL}${dictionaryUrl}${row.id}/`}>
                          <Button size="small" variant="text" color="primary">
                            Copy
                          </Button>
                        </Tooltip>
                      </CopyToClipboard>
                    </TableCell>
                      <TableCell>
                          {showCreateVersionButton ?
                              <Switch
                              data-testid={row.id}
                              checked={row.released}
                              onChange={() => openDialog(row)}
                              name="checkReleaseStatus"
                              color="primary"
                              /> :
                              <Tooltip title="You don’t have permission to change the status">
                                  <Switch
                                      data-testid={row.id}
                                      checked={row.released}
                                      name="checkReleaseStatus"
                                      disableRipple={true}
                                      color="primary"
                                      style={{cursor: "default", opacity: 1, backgroundColor: "transparent"}}
                                  />
                              </Tooltip>}
                      </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <Typography align="center">No released versions</Typography>
        )}
        <br />
        {!showCreateVersionButton ? null : (
          <ButtonGroup fullWidth variant="text" color="primary">
            <Button onClick={handleClickOpen}>Release new version</Button>
          </ButtonGroup>
        )}
      </fieldset>
      <ConfirmationDialog
          open={confirmDialogOpen}
          setOpen={setConfirmDialogOpen}
          onConfirm={() => handleReleaseVersionChange()}
          message={confirmationMsg()}
          cancelButtonText={"No"}
          confirmButtonText={"Yes"}
      />
      <Dialog onClose={handleClose} open={open}>
        <DictionaryVersionForm
          onSubmit={createDictionaryVersion}
          loading={createVersionLoading}
          handleClose={handleClose}
          error={createVersionError}
        />
      </Dialog>
    </Paper>
  );
};

export default ReleasedVersions;
