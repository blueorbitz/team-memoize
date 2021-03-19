import React from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router";

const AuthRoute = props => {
  const { user: { from }, path } = props;
  let isLogin = from !== '';

  if (path === '/login' && isLogin) {
    return <Redirect to="/" />;
  }
  else if (path !== '/login' && !isLogin) {
    return <Redirect to="/login" />;
  }
  else
    return <Route {...props} />;
};

const mapStateToProps = state => state;

export default connect(mapStateToProps)(AuthRoute);