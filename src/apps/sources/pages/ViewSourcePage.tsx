import React, { useEffect } from "react";
import SourceForm from "../components/SourceForm";
import {Grid, Paper, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import {
    APISource,
    apiSourceToSource
} from "../types";
import {
    orgsSelector,
    profileSelector
} from "../../authentication/redux/reducer";
import { APIOrg, APIProfile} from "../../authentication";
import {
    sourceSelector,
    retrieveSourceAndDetailsAction,
    retrieveSourceErrorSelector,
    retrieveSourceLoadingSelector
} from "../redux";
import { AppState } from "../../../redux";
import {useLocation} from "react-router-dom";
import { ProgressOverlay } from "../../../utils/components";
import Header from "../../../components/Header";

interface Props {
    profile?: APIProfile;
    usersOrgs?: APIOrg[];
    sourceLoading: boolean;
    source?: APISource;
    retrieveSourceAndDetails: (
        ...args: Parameters<typeof retrieveSourceAndDetailsAction>
    ) => void;
    retrieveSourceErrors?: {};
}

const ViewSourcePage: React.FC<Props> = ({
                                                 profile,
                                                 usersOrgs = [],
                                                 sourceLoading,
                                                 source,
                                                 retrieveSourceAndDetails,
                                                 retrieveSourceErrors
                                             }: Props) => {
    const { pathname: url, state } = useLocation();
    const previousPath = state ? state.prevPath : '';

    useEffect(() => {
        retrieveSourceAndDetails(url);
    }, [url, retrieveSourceAndDetails]);

    const sourceType = (previousPath: String) => {
        switch (previousPath) {
            case '/sources/':
                return 'Public Sources';
            case '/user/sources/':
                return 'Your Sources';
            case '/user/orgs/sources/':
                return "Your Organisations' Sources";
            default:
                return 'Sources'
       }
    };

    return (
        <Header title={`${sourceType(previousPath)} > ${source?.name || ""}`} justifyChildren="space-around">
            <ProgressOverlay
            delayRender
            loading={sourceLoading}
            error={
                retrieveSourceErrors
                    ? "Could not load source. Refresh the page to retry"
                    : undefined
            }
        >
                <Grid id="viewSourcePage" item xs={5} component="div">
                    <Paper className="fieldsetParent">
                        <fieldset>
                            <Typography component="legend" variant="h5" gutterBottom>
                                General Details
                            </Typography>
                            <SourceForm
                                savedValues={apiSourceToSource(source)}
                                profile={profile}
                                usersOrgs={usersOrgs}
                                loading={true}
                            />
                        </fieldset>
                    </Paper>
                </Grid>
            </ProgressOverlay>
        </Header>
    );
};

const mapStateToProps = (state: AppState) => ({
    profile: profileSelector(state),
    usersOrgs: orgsSelector(state),
    sourceLoading: retrieveSourceLoadingSelector(state),
    source: sourceSelector(state),
    retrieveSourceErrors: retrieveSourceErrorSelector(state)
});
const mapDispatchToProps = {
    retrieveSourceAndDetails: retrieveSourceAndDetailsAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewSourcePage);
