import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import {
    Button,
    ButtonGroup,
    Dialog,
    Paper,
    Table,
    TableContainer,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    Switch,
    IconButton,
    Menu,
    MenuItem,
    makeStyles,
    Grid,
} from "@material-ui/core";
import {
    MoreVert as MoreVertIcon,
    FileCopy as FileCopyIcon,
    Visibility as VisibilityIcon
} from "@material-ui/icons";
import { Link } from "react-router-dom";
import { TRADITIONAL_OCL_URL } from "../../../utils";
import {APIDictionaryVersion, DictionaryVersion} from "../types";
import DictionaryVersionForm from "./DictionaryVersionForm";
import ConfirmationDialog from "../../../utils/components/ConfirmationDialog";
import moment from 'moment';

interface Props {
  versions: APIDictionaryVersion[];
  showCreateVersionButton: boolean;
  createDictionaryVersion: Function;
  editDictionaryVersion: Function;
  createVersionLoading: boolean;
  createVersionError?: { detail: string };
  dictionaryUrl: string;
}
const useStyles = makeStyles({
  container: {
    maxHeight: 400,
  },
  buttonLink: {
    textDecoration: "none",
    color: "inherit",
  },
    addLeftPadding:{
      paddingLeft: 5
    },
});
const ReleasedVersions: React.FC<Props> = ({
  versions,
  showCreateVersionButton,
  createDictionaryVersion,
  editDictionaryVersion,
  createVersionLoading,
  createVersionError,
  dictionaryUrl
}) => {
  const versionsToDisplay = versions.filter((row) => row.id !== "HEAD");
  const [version, setVersion] = React.useState<DictionaryVersion>({
    id: "",
    released: false,
    description: "",
    external_id: "",
  });
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [dictionaryVersion, setDictionaryVersion] = React.useState<
    DictionaryVersion
  >({
    id: "",
    released: false,
    description: "",
    external_id: "",
  });
  const handleClick = (
      event: React.MouseEvent<HTMLElement>,
      version: DictionaryVersion
  ) => {
    setAnchorEl(event.currentTarget);
    setVersion(version);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  return (
      <Paper className='fieldsetParent'>
        <fieldset style={{ minWidth: "0" }}>
          <Typography component='legend' variant='h5' gutterBottom>
            Versions
          </Typography>
          {versionsToDisplay.length > 0 ? (
              <TableContainer className={classes.container}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Date Created</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Release Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {versionsToDisplay.map((row: APIDictionaryVersion) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.id}</TableCell>
                          <TableCell>{row.created_on ? moment(row.created_on).format("DD MMM YYYY") : ""}</TableCell>
                          <TableCell style={{ wordBreak: "break-all" }}>
                            {row.description || "None"}
                          </TableCell>
                          <TableCell>
                            {showCreateVersionButton ? (
                                <Switch
                                    data-testid={row.id}
                                    checked={row.released}
                                    onChange={() => openDialog(row)}
                                    name='checkReleaseStatus'
                                    color='primary'
                                />
                            ) : (
                                <Tooltip title="You don't have permission to change the status">
                          <Switch
                            data-testid={row.id}
                            checked={row.released}
                            name='checkReleaseStatus'
                            disableRipple={true}
                            color='primary'
                            style={{
                              cursor: "default",
                              opacity: 1,
                              backgroundColor: "transparent",
                            }}
                          />
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell>
                      <Tooltip title='More actions' enterDelay={700}>
                        <IconButton
                          data-testid={"more-actions"}
                          aria-label='more'
                          aria-controls='menu'
                          aria-haspopup='true'
                          onClick={(e) => handleClick(e, row)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Tooltip>
                      <Menu
                        id='long-menu'
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMenu}
                      >
                          <MenuItem onClick={handleCloseMenu} component={Link}
                                    to={`${dictionaryUrl}${version.id}/concepts/`}>
                              <Grid data-testid={"view-concepts"}>
                              <VisibilityIcon fontSize={"small"}/>
                                  <span className={classes.addLeftPadding}> View Concepts</span>
                              </Grid>
                          </MenuItem>
                        {!version.released ? null : (
                          <MenuItem onClick={handleCloseMenu}>
                            <CopyToClipboard
                              text={`${
                                version.released
                                  ? `${TRADITIONAL_OCL_URL}${dictionaryUrl}${version.id}/`
                                  : null
                              }`}
                            >
                                <Grid data-testid={"copy-subscription-url"}>
                                <FileCopyIcon fontSize={"small"} />
                                <span className={classes.addLeftPadding}>Copy Subscription URL</span>
                                </Grid>
                            </CopyToClipboard>
                          </MenuItem>
                        )}
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
           <Typography align='center'>No versions created</Typography>
        )}
        <br />
        {!showCreateVersionButton ? null : (
          <ButtonGroup fullWidth variant='text' color='primary'>
            <Button onClick={handleClickOpen}>Create new version</Button>
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
