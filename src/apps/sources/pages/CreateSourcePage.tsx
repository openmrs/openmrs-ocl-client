import React from "react";
import { Grid, Paper } from "@material-ui/core";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import {
    createSourceDispatchAction,
    createSourceErrorsSelector,
    createSourceLoadingSelector
} from "../redux";
import {APISource} from "../types";
import {
    orgsSelector,
    profileSelector
} from "../../authentication/redux/reducer";
import { APIOrg, APIProfile } from "../../authentication";
import {usePrevious} from "../../../utils";
import { CONTEXT } from "../constants";
import SourceForm from "../components/SourceForm";

interface Props {
    errors?: {};
    profile?: APIProfile;
    usersOrgs?: APIOrg[];
    createSourceAction: (
        ...args: Parameters<typeof createSourceDispatchAction>
    ) => void;
    loading: boolean;
    newSource?: APISource;
}

const CreateSourcePage: React.FC<Props> = ({
  profile,
  usersOrgs,
  errors,
  createSourceAction,
  loading,
  newSource
  }: Props) => {
    const previouslyLoading = usePrevious(loading);

    if (!loading && previouslyLoading && newSource) {
        return <Redirect to={newSource.url} />;
    }

    return (
        <Grid id="create-source-page" item xs={6} component="div">
            <Paper>
                <SourceForm
                    context={CONTEXT.create}
                    errors={errors}
                    profile={profile}
                    usersOrgs={usersOrgs ? usersOrgs : []}
                    loading={loading}
                    onSubmit={(values: APISource) => createSourceAction(values)}
                />
            </Paper>
        </Grid>
    );
};

export const mapStateToProps = (state: any) => ({
    profile: profileSelector(state),
    usersOrgs: orgsSelector(state),
    loading: createSourceLoadingSelector(state),
    newSource: state.sources.newSource,
    errors: createSourceErrorsSelector(state)
});
export const mapActionsToProps = {
    createSourceAction: createSourceDispatchAction
};

export default connect(
    mapStateToProps,
    mapActionsToProps
)(CreateSourcePage);
