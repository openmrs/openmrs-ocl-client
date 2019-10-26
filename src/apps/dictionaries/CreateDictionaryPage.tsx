import React from 'react';
import DictionaryForm from "./components";
import {Grid, Paper} from "@material-ui/core";
import "./CreateDictionaryPage.scss";
import {connect} from "react-redux";
import {
    createDictionaryLoadingSelector,
    createDictionaryProgressSelector,
    createSourceCollectionDictionaryAction
} from "./redux";
import {Dictionary} from "./types";

interface Props {
    createSourceCollectionDictionary: Function,
    loading: boolean,
    errors?: any,
}

const CreateDictionaryPage: React.FC<Props> = ({createSourceCollectionDictionary, loading}: Props) => {
    return (
        <Grid item xs={6} component="div">
            <Paper>
                <DictionaryForm loading={loading} onSubmit={(values: Dictionary) => createSourceCollectionDictionary(values)}/>
            </Paper>
        </Grid>
    )
};

const mapStateToProps = (state: any) => ({
    loading: createDictionaryLoadingSelector(state),
    progress: createDictionaryProgressSelector(state),
    // errors: authErrorsSelector(state),
});
const mapDispatchToProps = {
    createSourceCollectionDictionary: createSourceCollectionDictionaryAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateDictionaryPage);
