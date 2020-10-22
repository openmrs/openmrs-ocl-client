import React, { useEffect } from "react";
import { Grid, Paper } from "@material-ui/core";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import {
    createSourceDispatchAction,
    createSourceErrorsSelector,
    createSourceLoadingSelector,
    resetCreateSourceAction
} from "../redux";
import {APISource} from "../types";
import {
    orgsSelector,
    profileSelector
} from "../../authentication/redux/reducer";
import { APIOrg, APIProfile } from "../../authentication";
import { CONTEXT, usePrevious } from "../../../utils";
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
    resetCreateSource: () => void;
}

const CreateSourcePage: React.FC<Props> = ({
  profile,
  usersOrgs,
  errors,
  createSourceAction,
  loading,
  resetCreateSource,
  newSource
  }: Props) => {
    const previouslyLoading = usePrevious(loading);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => resetCreateSource, []);

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
    createSourceAction: createSourceDispatchAction,
    resetCreateSource: resetCreateSourceAction
};

export default connect(
    mapStateToProps,
    mapActionsToProps
)(CreateSourcePage);
