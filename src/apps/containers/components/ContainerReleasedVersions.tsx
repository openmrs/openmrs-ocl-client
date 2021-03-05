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
import { BASE_URL } from "../../../utils";
import ConfirmationDialog from "../../../utils/components/ConfirmationDialog";
import dayjs from 'dayjs';
import ContainerVersionForm from './ContainerVersionForm';
import { Version } from "../../../utils";
import { APIDictionary } from "../../dictionaries/types";

interface Props {
  versions: Version[];
  showCreateVersionButton: boolean;
  createVersion: Function;
  editVersion: Function;
  createVersionLoading: boolean;
  createVersionError?: { detail: string };
  url: string;
  type: string;
  dictionary?: APIDictionary;
}
const useStyles = makeStyles({
    link: {
        textDecoration: "none",
        color: "inherit",
        width: "100%"
    },
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
const ContainerReleasedVersions: React.FC<Props> = ({
  versions,
  showCreateVersionButton,
  createVersion,
  editVersion,
  createVersionLoading,
  createVersionError,
  url,
  type,
  dictionary
}) => {
  const versionsToDisplay = versions.filter((row) => row.id !== "HEAD");

  // move below block to dictionary version & source version files
  const [version, setVersion] = React.useState<Version>({
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
    editVersion({
      id: version.id,
      released: !version.released,
    });
    setConfirmDialogOpen(false);
  };

  const openDialog = (row: Version) => {
    setConfirmDialogOpen(true);
    setVersion(row);
  };

  const confirmationMsg = () => {
    return (
      <div>
        <span>Are you sure to mark version </span>
        <span style={{ fontWeight: "bold" }}>
          {version.id}
        </span> as{" "}
        {version.released ? (
          <span style={{ color: "#f50057" }}>unreleased</span>
        ) : (
          <span style={{ color: "#f50057" }}>released</span>
        )}
        ?
      </div>
    );
  };

  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  
  const handleClick = (
      event: React.MouseEvent<HTMLElement>,
      version: Version
  ) => {
    setAnchorEl(event.currentTarget);
    setVersion(version);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const copySubscriptionUrl = () => {
    if(version.released && type === "Dictionary"){ 
      return (
        <MenuItem onClick={handleCloseMenu}>
          <CopyToClipboard
            text={`${
              version.released
                ? `${BASE_URL}${url}${version.id}/`
                : null
            }`}
          >
              <Grid data-testid={"copy-subscription-url"}>
              <FileCopyIcon fontSize={"small"} />
              <span className={classes.addLeftPadding}>Copy Subscription URL</span>
              </Grid>
          </CopyToClipboard>
        </MenuItem>
      )
    }
  };
    const copyDictionary = () => {
        if(version.released && type === "Dictionary"){
            return (
              <MenuItem onClick={handleCloseMenu}>
                <Grid data-testid={"copy-dictionary"}>
                    <FileCopyIcon fontSize={"small"} />
                    <Link 
                      className={classes.link} to={`/collections/new/?copyFrom=${dictionary?.url}`}>
                        Copy Dictionary
                    </Link>
                </Grid>
              </MenuItem>
            )
        }
    };

  const releaseStatus = (row: Version) => {
    if(showCreateVersionButton) {
      return(
        <Switch
          data-testid={row.id}
          checked={row.released}
          onChange={() => openDialog(row)}
          name='checkReleaseStatus'
          color='primary'
        />
      )
     }else{
       return(
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
       )
     }
  }

  const versionTable = () => {
    if(versionsToDisplay.length > 0){
      return(
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
              {versionsToDisplay.map((row: Version) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.created_on ? dayjs(row.created_on).format("DD MMM YYYY") : ""}</TableCell>
                  <TableCell style={{ wordBreak: "break-all" }}>
                    {row.description || "None"}
                  </TableCell>
                  <TableCell>
                    {releaseStatus(row)}
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
                              to={`${url}${version.id}/concepts/`}>
                        <Grid data-testid={"view-concepts"}>
                        <VisibilityIcon fontSize={"small"}/>
                          <span className={classes.addLeftPadding}> View Concepts</span>
                        </Grid>
                      </MenuItem>
                      {copySubscriptionUrl()}
                      {copyDictionary()}
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )
    }else{
      return  <Typography align='center'>No versions created</Typography>
    }
  }

  const createVersionButton = () => {
    if(showCreateVersionButton){
      return (
          <ButtonGroup fullWidth variant='text' color='primary'>
            <Button onClick={handleClickOpen}>Create new version</Button>
          </ButtonGroup>
        )
      }
  }

  return (
    <Paper className='fieldsetParent'>
      <fieldset style={{ minWidth: "0" }}>
        <Typography component='legend' variant='h5' gutterBottom>
          Versions
        </Typography>
        {versionTable()}
        <br />
        {createVersionButton()}
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
        <ContainerVersionForm
          onSubmit={createVersion}
          loading={createVersionLoading}
          handleClose={handleClose}
          error={createVersionError}
        />
      </Dialog>
    </Paper>
  );
};

export default ContainerReleasedVersions
