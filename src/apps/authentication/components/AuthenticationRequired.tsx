import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  getUserDetailsAction,
  getUserDetailsLoadingSelector,
  profileSelector
} from "../redux";
import { APIProfile } from "../types";
import { ProgressOverlay } from "../../../utils/components";

interface Props {
  children: any;
  isLoggedIn: boolean;
  getProfile: Function;
  profile?: APIProfile;
  profileLoading: boolean;
}

export const AuthenticationRequired: React.FC<Props> = ({
  children: Component,
  isLoggedIn,
  getProfile,
  profile,
  profileLoading
}: Props) => {
  useEffect(() => {
    if (isLoggedIn) getProfile();
  }, [isLoggedIn, getProfile]);

  if (!isLoggedIn) return <Redirect to="/login" />;

  return (
    <ProgressOverlay
      delayRender
      loading={profileLoading}
      loadingMessage="Setting things up..."
    >
      <Component profile={profile} />
    </ProgressOverlay>
  );
};

const mapStateToProps = (state: any) => ({
  isLoggedIn: state.auth.isLoggedIn,
  profile: profileSelector(state),
  profileLoading: getUserDetailsLoadingSelector(state)
});

const mapDispatchToProps = { getProfile: getUserDetailsAction };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthenticationRequired);
