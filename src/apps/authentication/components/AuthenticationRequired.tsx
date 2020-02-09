import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { getUserDetailsAction, getUserDetailsLoadingSelector, profileSelector } from '../redux'
import { APIProfile } from '../types'

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

  return !isLoggedIn ? (
    <Redirect to="/login" />
  ) : profileLoading ? (
    <span>Loading...</span>
  ) : (
    <Component profile={profile} />
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
