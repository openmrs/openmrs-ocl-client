import React from 'react';
import {APISource} from "../../sources";
import {APICollection} from "../../collections";
import { Button, ButtonGroup, makeStyles, Paper, Typography } from '@material-ui/core'
import './DictionaryDetails.scss';
import {Link} from "react-router-dom";

interface Props {
    source?: APISource,
    collection?: APICollection,
}

const useStyles = makeStyles({
    link: {
        textDecoration: 'none',
        color: 'inherit',
    },
});

const DictionaryDetails: React.FC<Props> = ({source, collection}) => {
    const classes = useStyles();

    if (!(source && collection)) {
        return <span>Could not retrieve dictionary details</span>
    }
    const {active_concepts: sourceConceptCount = 0, concepts_url: sourceConceptsUrl} = source;
    const {active_concepts: collectionConceptCount = 0, concepts_url: collectionConceptsUrl} = collection;

    return (
        <Paper className="fieldsetParent">
            <fieldset>
                <Typography component="legend" variant="h5" gutterBottom>Concepts(HEAD Version)</Typography>
                <Typography variant="h6" gutterBottom>
                    <b>Total Concepts: {sourceConceptCount + collectionConceptCount}</b>
                </Typography>
                <Typography component="div" variant="h6" gutterBottom id="conceptCountBreakDown">
                    From CIEL: {collectionConceptCount}
                    <br/>
                    Custom Concepts: {sourceConceptCount}
                </Typography>
                <ButtonGroup variant="text" fullWidth>
                    <Button color='primary'>
                        <Link className={classes.link} to={sourceConceptsUrl}>View Custom Concepts</Link>
                    </Button>
                    <Button color='primary'>
                        <Link className={classes.link} to={collectionConceptsUrl}>View CIEL Concepts</Link>
                    </Button>
                </ButtonGroup>
            </fieldset>
        </Paper>
    );
};

export default DictionaryDetails;
