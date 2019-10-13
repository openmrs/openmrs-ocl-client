import React from "react";
import { connect } from 'react-redux';
import {Redirect} from "react-router-dom";

interface Props {
    children: any,
    isLoggedIn: boolean,
}

export const AuthenticationRequired: React.FC<Props> = ({children, isLoggedIn}: Props) => {
    return !isLoggedIn ? <Redirect to="/login"/> : children;
};

const mapStateToProps = (state: any) => ({
    isLoggedIn: state.auth.isLoggedIn,
});

export default connect(mapStateToProps)(AuthenticationRequired);
