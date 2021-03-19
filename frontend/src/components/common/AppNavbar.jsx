import React, { Component } from 'react';
import { connect } from 'react-redux';
import { UserAction } from '../../actions';
import { ApiService } from '../../services';

class AppNavBar extends Component {
  constructor(props) {
    // Inherit constructor
    super(props);

    //Bind functions
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout(event) {
    const { setUser } = this.props;

    ApiService.logout();
    setUser({ from: '' });
  }

  render() {
    return (
      <div className="navbar">
        <div className="container d-flex justify-content-between">
          <div className="navbar-brand">Memoize</div>
          <a href="#" className="navbar-text" onClick={ this.handleLogout }>
            Logout
          </a>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => state;
// Map the following action to props
const mapDispatchToProps = {
  setUser: UserAction.setUser,
};


export default connect(mapStateToProps, mapDispatchToProps)(AppNavBar);