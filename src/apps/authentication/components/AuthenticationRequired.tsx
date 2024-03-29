import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Redirect, useLocation } from "react-router-dom";
import {
  getUserDetailsAction,
  getUserDetailsLoadingSelector,
  profileSelector,
  setNextPageAction
} from "../redux";
import { APIProfile } from "../types";
import { ProgressOverlay } from "../../../utils/components";
import { AppState } from "../../../redux";

interface Props {
  children: any;
  isLoggedIn: boolean;
  getProfile: Function;
  profile?: APIProfile;
  profileLoading: boolean;
  setNextPage: (...args: Parameters<typeof setNextPageAction>) => void;
}

export const AuthenticationRequired: React.FC<Props> = ({
  children: Component,
  isLoggedIn,
  getProfile,
  profile,
  profileLoading,
  setNextPage
}) => {
  const getProfileCalled = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      getProfileCalled.current = true;
      setIsLoading(true);
      getProfile();
    }
  }, [isLoggedIn, getProfile]);

  useEffect(() => {
    if (!profileLoading && getProfileCalled.current) {
      setIsLoading(false);
    }
  }, [profileLoading]);

  const location = useLocation();

  if (!isLoggedIn) {
    const currentPage = location.pathname + location.search + location.hash;
    setNextPage(currentPage);
    return <Redirect to="/login" />;
  }

  return (
    <ProgressOverlay
      delayRender
      loading={isLoading}
      loadingMessage="Setting things up..."
    >
      <Component profile={profile} />
    </ProgressOverlay>
  );
};

const mapStateToProps = (state: AppState) => ({
  isLoggedIn: state.auth.isLoggedIn,
  profile: profileSelector(state),
  profileLoading: getUserDetailsLoadingSelector(state)
});

const mapDispatchToProps = {
  getProfile: getUserDetailsAction,
  setNextPage: setNextPageAction
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthenticationRequired);
