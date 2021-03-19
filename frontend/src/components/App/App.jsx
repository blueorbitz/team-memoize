
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch } from 'react-router-dom';
//Components
import { Login, Home, Detail } from '../../components';
import AuthRoute from '../common/AuthRoute';
// Services and redux action
import { UserAction } from '../../actions';
import { ApiService } from '../../services';

class App extends Component {

  constructor(props) {
    // Inherit constructor
    super(props);
    // State for showing/hiding components when the API (blockchain) request is loading
    this.state = {
      loading: true,
    };
    // Bind functions
    this.getCurrentUser = this.getCurrentUser.bind(this);
    // Call getCurrentUser before mounting the app
    this.getCurrentUser();
  }

  getCurrentUser() {
    // Extract setUser of UserAction from redux
    const { setUser } = this.props;
    // Send a request to API (blockchain) to get the current logged in user
    return ApiService.getCurrentUser()
      // If the server return a username
      .then(from => {
        // Save the username to redux store
        // For structure, ref: ./frontend/src/reducers/UserReducer.js
        setUser({ from });
      })
      // To ignore 401 console error
      .catch(() => { })
      // Run the following function no matter the server return success or error
      .finally(() => {
        // Set the loading state to false for displaying the app
        this.setState({ loading: false });
      });
  }

  render() {
    const { loading } = this.state;

    return (
      <Switch>
        <AuthRoute exact path="/login">
          <div className={`App app-login ${loading ? 'app-loading' : ''}`}>
            <Login />
          </div>
        </AuthRoute>
        <AuthRoute exact path="/" component={Home} />
        <AuthRoute path="/detail/:plate_number" component={Detail} />
      </Switch>
    );
  }

}

// Map all state to component props (for redux to connect)
const mapStateToProps = state => state;

// Map the following action to props
const mapDispatchToProps = {
  setUser: UserAction.setUser,
};

// Export a redux connected component
export default connect(mapStateToProps, mapDispatchToProps)(App);
