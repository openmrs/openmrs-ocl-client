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

const DictionaryDetails: React.FC<Props> = ({ dictionary }) => {
  const classes = useStyles();

  const {
    references,
    concepts_url: conceptsUrl,
    preferred_source: preferredSource
  } = dictionary;

  const conceptReferences = references
    ? references.filter(({ reference_type }) => reference_type === "concepts")
    : [];
  const fromPreferredSource = conceptReferences.filter(({ expression }) =>
    expression.includes(preferredSource)
  ).length;
  const customConceptCount = conceptReferences.length - fromPreferredSource;

  return (
    <Paper className="fieldsetParent">
      <fieldset>
        <Typography component="legend" variant="h5" gutterBottom>
          Concepts(HEAD Version)
        </Typography>
        <Typography variant="h6" gutterBottom>
          <b>Total Concepts: {conceptReferences.length}</b>
        </Typography>
        <Typography
          component="div"
          variant="h6"
          gutterBottom
          className={classes.conceptCountBreakDown}
        >
          <span data-testid="preferredConceptCount">
            From {preferredSource}: {fromPreferredSource}
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

export default DictionaryDetails;
