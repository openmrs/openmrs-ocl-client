import React, {useEffect} from "react";
import { connect } from 'react-redux';
import {Redirect} from "react-router-dom";
import {getProfileAction} from "./redux";

interface Props {
    children: any,
    isLoggedIn: boolean,
    getProfile: Function,
}

export const AuthenticationRequired: React.FC<Props> = ({children, isLoggedIn, getProfile}: Props) => {
    useEffect(() => {
        if (isLoggedIn) getProfile();
    }, [isLoggedIn, getProfile]);

    return !isLoggedIn ? <Redirect to="/login"/> : children;
};

const mapStateToProps = (state: any) => ({
    isLoggedIn: state.auth.isLoggedIn,
});

const mapDispatchToProps = {getProfile: getProfileAction};

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticationRequired);
