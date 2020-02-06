import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import {
  Button,
  ButtonGroup,
  makeStyles,
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
import { DictionaryVersion } from "../types";
import { BASE_URL } from "../../../utils";

interface Props {
  versions: DictionaryVersion[];
  subscriptionUrl: string;
  canEditDictionary: boolean;
}

const useStyles = makeStyles({
  link: {
    textDecoration: "none",
    color: "inherit"
  }
});

const ReleasedVersions: React.FC<Props> = ({ versions, subscriptionUrl, canEditDictionary }) => {
  const classes = useStyles();
  const versionsToDisplay = versions.filter(row => row.id !== 'HEAD');

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
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {versionsToDisplay.map((row: DictionaryVersion) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.description || "None"}</TableCell>
                    <TableCell>
                      <Button size="small" variant="text" color="primary">
                        <Link
                          className={classes.link}
                          to={`${row.version_url}concepts/`}
                        >
                          View concepts
                        </Link>
                      </Button>
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
          <CopyToClipboard text={`${BASE_URL}${subscriptionUrl}`}>
            <Tooltip title={`Copy ${BASE_URL}${subscriptionUrl}`}>
              <Button>Copy subscription URL</Button>
            </Tooltip>
          </CopyToClipboard>
          {!canEditDictionary ? null : (
            <Button>Release new version</Button>
          )}
        </ButtonGroup>
      </fieldset>
    </Paper>
  );
};

export default ReleasedVersions;
