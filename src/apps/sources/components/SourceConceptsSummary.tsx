import React from "react";
import { APISource } from "../../sources";
import {
  Button,
  ButtonGroup,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { StarBorder, DeleteForever } from "@material-ui/icons";

interface Props {
  source?: APISource;
  totalConceptCount: number;
  activeConceptCount: number;
}

const SourceConceptsSummary: React.FC<Props> = ({
  source,
  totalConceptCount,
  activeConceptCount
}) => {
  const total_concepts: number = totalConceptCount;
  const active_concepts: number = activeConceptCount;
  const retire_concepts: number = total_concepts - active_concepts;

  return (
    <Paper className="fieldsetParent">
      <fieldset>
        <Typography component="legend" variant="h5" gutterBottom>
          Concepts(HEAD Version)
        </Typography>
        <Typography variant="h6" data-testid="concepts-summary" gutterBottom>
          <b>{`Total Concepts: ${total_concepts}`}</b>
          <List component="div" disablePadding>
            <ListItem>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary={`Active Concepts: ${active_concepts}`} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <DeleteForever />
              </ListItemIcon>
              <ListItemText primary={`Retired Concepts: ${retire_concepts}`} />
            </ListItem>
          </List>
        </Typography>
        <ButtonGroup variant="text" fullWidth>
          <Button
            to={source?.concepts_url || ""}
            component={Link}
            color="primary"
          >
            View Concepts
          </Button>
        </ButtonGroup>
      </fieldset>
    </Paper>
  );
};

export default SourceConceptsSummary;
