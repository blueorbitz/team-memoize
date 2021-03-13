import React, { Component } from 'react';
// Components

// Bootstrap login template = https://bootsnipp.com/snippets/7nk08

class Login extends Component {

  constructor(props) {
    // Inherit constructor
    super(props);
    // State for form data and error message
    this.state = {
      form: {
        username: '',
        key: '',
      },
      error: '',
    }

    //Bind functions
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

    //TODO: submit credentials to the blockchain
  }

  render() {
    const { form, error } = this.state;
 
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
              <form>
                <div className="form-group">
                  <label>Account Name</label>
                  <input
                    className="form-control"
                    type="text"
                    name="username"
                    placeholder="All small letters, a-z, 1-5 or dot, max 12 characters"
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
                    pattern="^.{51,}$"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-black">Login</button>
              </form>
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

export default Login;