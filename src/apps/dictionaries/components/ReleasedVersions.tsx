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
  Typography
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { APIDictionaryVersion } from "../types";
import { BASE_URL } from "../../../utils";
import DictionaryVersionForm from "./DictionaryVersionForm";

interface Props {
  versions: APIDictionaryVersion[];
  showCreateVersionButton: boolean;
  createDictionaryVersion: Function;
  createVersionLoading: boolean;
  createVersionError?: { detail: string };
  dictionaryUrl: string;
}

const ReleasedVersions: React.FC<Props> = ({
  versions,
  showCreateVersionButton,
  createDictionaryVersion,
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

  return (
    <Paper className="fieldsetParent">
      <fieldset>
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
                </TableRow>
              </TableHead>
              <TableBody>
                {versionsToDisplay.map((row: APIDictionaryVersion) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.description || "None"}</TableCell>
                    <TableCell>
                      <Button
                        // not row.url because the response immediately after creating a new version is missing the url attribute for some reason
                        to={`${dictionaryUrl}${row.id}/concepts/`}
                        component={Link}
                        size="small"
                        variant="text"
                        color="primary"
                      >
                        View concepts
                      </Button>
                    </TableCell>
                    <TableCell>
                      <CopyToClipboard text={`${dictionaryUrl}${row.id}/`}>
                        <Tooltip title={`${dictionaryUrl}${row.id}/`}>
                          <Button size="small" variant="text" color="primary">
                            Copy
                          </Button>
                        </Tooltip>
                      </CopyToClipboard>
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
        <ButtonGroup fullWidth variant="text" color="primary">
          {!showCreateVersionButton ? null : (
            <Button onClick={handleClickOpen}>Release new version</Button>
          )}
        </ButtonGroup>
      </fieldset>

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
