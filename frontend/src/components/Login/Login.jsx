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
    });
  }

  handleSubmit(event) {
    //Suppress the default submit behavior
    event.preventDefault();

    //TODO: submit credentials to the blockchain
  }

  render() {
    const { form } = this.state;

    return (
      <div className="Login">
        <div class="sidenav">
          <div class="login-main-text">
            <h2>Memoize<br /> Vehicle Info on Blockchain</h2>
            <p>Record key info, service/repair history, fuel up history and more...</p>
          </div>
        </div>
        <div class="main">
          <div class="col-md-6 col-sm-12">
            <div class="login-form">
              <form>
                <div class="form-group">
                  <label>Account Name</label>
                  <input
                    class="form-control"
                    type="text"
                    name="username"
                    placeholder="All small letters, a-z, 1-5 or dot, max 12 characters"
                    pattern="[\.a-z1-5]{2,12}"
                    required
                  />
                </div>
                <div class="form-group">
                  <label>Private key</label>
                  <input
                    class="form-control"
                    type="password"
                    name="key"
                    pattern="^.{51,}$"
                    required
                  />
                </div>
                <button type="submit" class="btn btn-black">Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;