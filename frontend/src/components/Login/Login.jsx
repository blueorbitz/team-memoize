import React, { Component } from 'react';
import { connect } from 'react-redux';
// Components

// Services and redux action
import { UserAction } from '../../actions';
import { ApiService } from '../../services';

// Bootstrap login template = https://bootsnipp.com/snippets/7nk08

class Login extends Component {

  constructor(props) {
    // Inherit constructor
    super(props);
    // State for form data and error message
    this.state = {
      form: {
        from: '',
        key: '',
      },
      error: '',
      isSigningIn: false,
    }

    //Bind functions
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.isComponentMounted = true;
  }

  componentWillUnmount() {
    this.isComponentMounted = false;
  }

  handleChange(event) {
    const { name, value } = event.target;
    const { form } = this.state;

    this.setState({
      form: {
        ...form,
        [name]: value,
      },
      error: '',
    });
  }

  handleSubmit(event) {
    //Suppress the default submit behavior
    event.preventDefault();

    // Extract `form` state
    const { form } = this.state;
    // Extract `setUser` of `UserAction` and `user.name` of UserReducer from redux
    const { setUser } = this.props;
    // Set loading spinner to the button
    this.setState({ isSigningIn: true });

    // Send a login transaction to the blockchain by calling the ApiService,
    // If it successes, save the username to redux store
    // Otherwise, save the error state for displaying the message
    return ApiService.login(form)
      .then((data) => {
        setUser({ from: form.from });
      })
      .catch(err => {
        this.setState({ error: err.toString() });
      })
      .finally(() => {
        if (this.isComponentMounted) {
          this.setState({ isSigningIn: false });
        }
      });
  }

  render() {
    const { form, error, isSigningIn } = this.state;
 
    return (
      <div className="Login">
        <div className="sidenav">
          <div className="login-main-text">
            <h2>Memoize<br /> Vehicle Info on Blockchain</h2>
            <p>Record key info, service/repair history, fuel up history and more...</p>
          </div>
        </div>
        <div className="main">
          <div className="col-md-6 col-sm-12">
            <div className="login-form">
              <form name="from" onSubmit={ this.handleSubmit }>
                <div className="form-group">
                  <label>Account Name</label>
                  <input
                    className="form-control"
                    type="text"
                    name="from"
                    value={ form.from }
                    placeholder="All small letters, a-z, 1-5 or dot, max 12 characters"
                    onChange={ this.handleChange }
                    pattern="[\.a-z1-5]{2,12}"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Private key</label>
                  <input
                    className="form-control"
                    type="password"
                    name="key"
                    value={ form.key }
                    onChange={ this.handleChange }
                    pattern="^.{51,}$"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-black">Login</button>
              </form>
              <p>Register an account <a href="https://testnet.eos.io">here</a>.</p>
              <div>
                {error && <span className="text-danger">{error}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(Login);
