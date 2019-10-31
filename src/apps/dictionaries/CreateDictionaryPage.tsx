import React from 'react';
import {DictionaryForm} from "./components";
import {Grid, Paper} from "@material-ui/core";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import {
    createDictionaryLoadingSelector,
    createDictionaryProgressSelector,
    createSourceCollectionDictionaryAction, createSourceCollectionDictionaryErrorsSelector,
} from "./redux";
import {APIDictionary, Dictionary} from "./types";
import {orgsSelector, profileSelector} from "../authentication/redux/reducer";
import {APIOrg, APIProfile} from "../authentication";
import {usePrevious} from "../../utils";

interface Props {
    errors?: {},
    profile?: APIProfile,
    usersOrgs?: APIOrg[],
    createSourceCollectionDictionary: Function,
    loading: boolean,
    newDictionary?: APIDictionary,
}

const CreateDictionaryPage: React.FC<Props> = ({profile, usersOrgs, errors, createSourceCollectionDictionary, loading, newDictionary}: Props) => {
    const previouslyLoading = usePrevious(loading);

    if (!loading && previouslyLoading && newDictionary && newDictionary.url) {
        return <Redirect to={newDictionary.url.replace('/collections/', '/dictionaries/')}/>;
    }

    return (
        <Grid id="create-dictionary-page" item xs={6} component="div">
            <Paper>
                <DictionaryForm errors={errors} profile={profile} usersOrgs={usersOrgs ? usersOrgs : []}
                                loading={loading}
                                onSubmit={(values: Dictionary) => createSourceCollectionDictionary(values)} editing/>
            </Paper>
        </Grid>
    )
};

const mapStateToProps = (state: any) => ({
    profile: profileSelector(state),
    usersOrgs: orgsSelector(state),
    loading: createDictionaryLoadingSelector(state),
    progress: createDictionaryProgressSelector(state),
    newDictionary: state.dictionaries.newDictionary,
    errors: createSourceCollectionDictionaryErrorsSelector(state),
});
const mapDispatchToProps = {
    createSourceCollectionDictionary: createSourceCollectionDictionaryAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateDictionaryPage);
