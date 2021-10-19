import React from "react";
import { APIDictionary } from "../../dictionaries";
import {
  Button,
  ButtonGroup,
  makeStyles,
  Paper,
  Typography
} from "@material-ui/core";
import { Link } from "react-router-dom";

interface Props {
  dictionary: APIDictionary;
}

const useStyles = makeStyles({
  conceptCountBreakDown: {
    marginLeft: "3vw"
  }
});

const DictionaryConceptsSummary: React.FC<Props> = ({ dictionary }) => {
  const classes = useStyles();

  const {
    concepts_url: conceptsUrl,
    preferred_source: preferredSource,
    concept_counts: {
      total: totalConceptCount = 0,
      from_preferred_source: preferredSourceConceptCount = 0,
      custom: customConceptCount = 0
    } = {},
  } = dictionary;

  return (
    <Paper className="fieldsetParent">
      <fieldset>
        <Typography component="legend" variant="h5" gutterBottom>
          Concepts(HEAD Version)
        </Typography>
        <Typography variant="h6" gutterBottom>
          <b>Total Concepts: {totalConceptCount}</b>
        </Typography>
        <Typography
          component="div"
          variant="h6"
          gutterBottom
          className={classes.conceptCountBreakDown}
        >
          <span data-testid="preferredConceptCount">
            From {preferredSource}: {preferredSourceConceptCount}
          </span>
          <br />
          <span data-testid="customConceptCount">
            Custom Concepts: {customConceptCount}
          </span>
        </Typography>
        <ButtonGroup variant="text" fullWidth>
          <Button to={conceptsUrl} component={Link} color="primary">
            View Concepts
          </Button>
        </ButtonGroup>
      </fieldset>
    </Paper>
  );
};

export default DictionaryConceptsSummary;
