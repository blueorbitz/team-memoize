import React from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router";

const AuthRoute = props => {
  const { user: { from }, path } = props;
  let isLogin = from !== '';

  if (path === '/' && !isLogin) {
    return <Redirect to="/login" />;
  }
  if (path === '/login' && isLogin) {
    return <Redirect to="/" />;
  }

  return <Route {...props} />;
};

const mapStateToProps = state => state;

export default connect(mapStateToProps)(AuthRoute);