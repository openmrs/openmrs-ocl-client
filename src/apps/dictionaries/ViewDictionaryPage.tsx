import React, {useEffect} from 'react';
import DictionaryForm from "./components";
import {Grid, Paper} from "@material-ui/core";
import "./ViewDictionaryPage.scss";
import {connect} from "react-redux";
import {APIDictionary, apiDictionaryToDictionary} from "./types";
import {orgsSelector, profileSelector} from "../authentication/redux/reducer";
import {APIOrg, APIProfile} from "../authentication";
import {
    retrieveDictionaryAndDetailsAction,
    retrieveDictionaryDetailsLoadingSelector,
    retrieveDictionaryLoadingSelector
} from "./redux";
import {AppState} from "../../redux";
import {useLocation} from "react-router-dom";
import {APISource} from "../sources";
import {APICollection} from "../collections";

interface Props {
    profile?: APIProfile,
    usersOrgs?: APIOrg[],
    dictionaryLoading: boolean,
    dictionaryDetailsLoading: boolean,
    dictionary?: APIDictionary,
    retrieveDictionaryAndDetails: Function,
    source?: APISource,
    collection?: APICollection,
}

const ViewDictionaryPage: React.FC<Props> = ({profile, usersOrgs, dictionaryLoading, dictionaryDetailsLoading, dictionary, retrieveDictionaryAndDetails}: Props) => {
    let {pathname: url} = useLocation();

    useEffect(() => {
        retrieveDictionaryAndDetails(url.replace('/dictionaries/', '/collections/'));
    }, [url, retrieveDictionaryAndDetails]);

    if (dictionaryLoading) return <span>'Loading...'</span>;

    return (
        <>
            <Grid item xs={5} component="div">
                <Paper>
                    <DictionaryForm savedValues={apiDictionaryToDictionary(dictionary)} profile={profile} usersOrgs={usersOrgs ? usersOrgs : []} loading={true} editing={false}/>
                </Paper>
            </Grid>
            <Grid item xs={5} component="div">
                {dictionaryDetailsLoading ? 'Loading...' : 'Dictionary Content Details'}
            </Grid>
        </>
    )
};

const mapStateToProps = (state: AppState) => ({
    profile: profileSelector(state),
    usersOrgs: orgsSelector(state),
    dictionaryLoading: retrieveDictionaryLoadingSelector(state),
    dictionary: state.dictionaries.dictionary,
    dictionaryDetailsLoading: retrieveDictionaryDetailsLoadingSelector(state),
    source: state.sources.source,
    collection: state.collections.collection,
});
const mapDispatchToProps = {
    retrieveDictionaryAndDetails: retrieveDictionaryAndDetailsAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewDictionaryPage);
