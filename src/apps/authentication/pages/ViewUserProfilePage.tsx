import React from "react";
import {Grid, Paper, Typography} from "@material-ui/core";
import {connect} from "react-redux";
import {APIOrg, APIProfile, getUserDetailsAction, profileSelector} from "../../authentication";
import {AppState} from "../../../redux";
import Header from "../../../components/Header";
import {orgsSelector} from "../redux/reducer";
import {UserForm, UserOrganisationDetails, UserTokenDetails} from "../components";


interface Props {
    userProfile?: APIProfile;
    userOrganisations?: APIOrg[];
    userToken?: string;
}

export const ViewUserProfilePage: React.FC<Props> = ({
                                                         userProfile,
                                                         userOrganisations,
                                                         userToken
                                                     }: Props) => {
    return (
        <Header
            title="Your Profile"
            justifyChildren='space-around'
        >
            <Grid id='viewUserProfilePage' item xs={5} component='div'>
                <Paper className='fieldsetParent'>
                    <fieldset>
                        <Typography component='legend' variant='h5' gutterBottom>
                            Details
                        </Typography>
                        <UserForm
                            savedValues={userProfile}
                            loading={true}
                        />
                    </fieldset>
                </Paper>
            </Grid>
            <Grid item xs={5} container spacing={2}>
                <Grid item xs={12} component='div'>
                    <UserTokenDetails
                        token={userToken}
                    />
                </Grid>
                <Grid item xs={12} component='div'>
                    <UserOrganisationDetails
                        orgs={userOrganisations}
                    />
                </Grid>
            </Grid>
        </Header>
    );
};

export const mapStateToProps = (state: AppState) => ({
    userProfile: profileSelector(state),
    userOrganisations: orgsSelector(state),
    userToken: state.auth.token
});
export const mapDispatchToProps = {
    retrieveUserDetails: getUserDetailsAction
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewUserProfilePage);
