import React from "react";
import { APIDictionary } from "../../dictionaries";
import {
  Button,
  ButtonGroup,
  makeStyles,
  Paper,
  Typography
} from "@material-ui/core";
import "./DictionaryDetails.scss";
import { Link } from "react-router-dom";
import { CIEL_SOURCE_URL } from '../../../utils/constants'

interface Props {
  dictionary: APIDictionary,
}

const useStyles = makeStyles({
  link: {
    textDecoration: "none",
    color: "inherit"
  }
});

const DictionaryDetails: React.FC<Props> = ({ dictionary }) => {
  const classes = useStyles();

  const {active_concepts: conceptCount, references, concepts_url: conceptsUrl} = dictionary;

  const conceptReferences = references ? references.filter(({ reference_type }) => reference_type === 'concepts') : [];
  const cielConceptCount = conceptReferences.filter(
    ({ expression }) => expression.includes(CIEL_SOURCE_URL),
  ).length;
  const customConceptCount = conceptReferences.length - cielConceptCount;

  return (
    <Paper className="fieldsetParent">
      <fieldset>
        <Typography component="legend" variant="h5" gutterBottom>
          Concepts(HEAD Version)
        </Typography>
        <Typography variant="h6" gutterBottom>
          <b>Total Concepts: {conceptCount}</b>
        </Typography>
        <Typography
          component="div"
          variant="h6"
          gutterBottom
          id="conceptCountBreakDown"
        >
          From CIEL: {cielConceptCount}
          <br />
          Custom Concepts: {customConceptCount}
        </Typography>
        <ButtonGroup variant="text" fullWidth>
          <Button color="primary">
            <Link className={classes.link} to={conceptsUrl}>
              View Concepts
            </Link>
          </Button>
        </ButtonGroup>
      </fieldset>
    </Paper>
  );
};

export default DictionaryDetails;
