import React from 'react';
import {Grid} from "@material-ui/core";
import { ConceptForm } from './components'

const CreateConceptPage = () => {
    return (
        <Grid item xs={8} component="div">
            <ConceptForm />
        </Grid>
    )
};

export default CreateConceptPage;
