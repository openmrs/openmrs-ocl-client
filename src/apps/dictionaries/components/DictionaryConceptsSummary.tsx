import React from "react";
import exportFromJSON from 'export-from-json'; //This seems to be reusuable in all sorts of exports i.e json,csv,txt etc
import { APIDictionary } from "../../dictionaries";
import {
  Button,
  ButtonGroup,
  makeStyles,
  Paper,
  Typography,
  Menu,
  MenuItem,
  IconButton
} from "@material-ui/core";
import { MoreVert, TableChartOutlined, FormatListBulleted } from "@material-ui/icons";
import { Link } from "react-router-dom";
import {useAnchor, getDate} from "../../../utils";

interface Props {
  dictionary: APIDictionary;
}

const useStyles = makeStyles({
  conceptCountBreakDown: {
    marginLeft: "3vw"
  },
  iconButton: {
    bottom: "1rem",
    left: "28rem",
    padding: "5px"
  },
  totalText: {
    marginTop: "-1rem"
  },
  addLeftPadding: {
    paddingLeft: "0.5rem"
  }
});

const DictionaryConceptsSummary: React.FC<Props> = ({ dictionary }) => {
  const [menuAnchor, handleMenuClick, handleMenuClose] = useAnchor();
  const classes = useStyles();
  console.log(dictionary, 'direction');

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


  const { updated_on = ''} = dictionary || {};
  const updatedDate = getDate(updated_on);

  return (
    <Paper className="fieldsetParent">
      <fieldset>
        <Typography component="legend" variant="h5" gutterBottom>
          Concepts(HEAD Version)
        </Typography>
        <IconButton
          className={classes.iconButton}
          data-testid={"more-actions"}
          aria-label='more'
          aria-controls='menu'
          aria-haspopup='true'
          onClick={handleMenuClick}>
          <MoreVert />
        </IconButton>
        <Menu
          id='long-menu'
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}>
            <MenuItem onClick={() => exportFromJSON({data: [dictionary], fileName: `${dictionary.name}_head_${updatedDate}.csv`, exportType: 'csv'})}>
              <TableChartOutlined /> 
              <span className={classes.addLeftPadding}>Export Head as CSV</span>
            </MenuItem>
            <MenuItem onClick={() => exportFromJSON({data: dictionary, fileName: `${dictionary.name}_head_${updatedDate}.json`, exportType: 'json'})}>
              <FormatListBulleted /> 
              <span className={classes.addLeftPadding}>Export Head as JSON</span>
            </MenuItem>
        </Menu>
        <Typography variant="h6" gutterBottom className={classes.totalText}>
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

export default DictionaryConceptsSummary;
