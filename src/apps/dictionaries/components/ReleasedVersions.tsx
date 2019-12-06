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
}

const useStyles = makeStyles({
  link: {
    textDecoration: "none",
    color: "inherit"
  }
});

const ReleasedVersions: React.FC<Props> = ({ versions, subscriptionUrl }) => {
  const classes = useStyles();

  return (
    <Paper className="fieldsetParent">
      <fieldset>
        <Typography component="legend" variant="h5" gutterBottom>
          Releases
        </Typography>
        {versions.length > 0 ? (
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
                {versions.map((row: DictionaryVersion) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.description || "None"}</TableCell>
                    <TableCell>
                      <Button size="small" variant="text" color="primary">
                        <Link
                          className={classes.link}
                          to={`${row.version_url.replace(
                            "/collections/",
                            "/dictionaries/"
                          )}concepts/`}
                        >
                          View concepts
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <br />
            <ButtonGroup fullWidth variant="text" color="primary">
              <CopyToClipboard text={`${BASE_URL}${subscriptionUrl}`}>
                <Tooltip title={`Copy ${BASE_URL}${subscriptionUrl}`}>
                  <Button>Copy subscription URL</Button>
                </Tooltip>
              </CopyToClipboard>
              <Button>Release new version</Button>
            </ButtonGroup>
          </div>
        ) : (
          <Typography align="center">No released versions</Typography>
        )}
      </fieldset>
    </Paper>
  );
};

export default ReleasedVersions;
