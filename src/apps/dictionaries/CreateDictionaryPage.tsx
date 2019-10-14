import React from 'react';
import DictionaryForm from "./components";
import {Grid} from "@material-ui/core";
import "./CreateDictionaryPage.scss";

const CreateDictionaryPage: React.FC = () => {
    return (
        <Grid item xs={6} component="div">
            <DictionaryForm loading={false} onSubmit={() => {}}/>
        </Grid>
    )
};

export default CreateDictionaryPage;
