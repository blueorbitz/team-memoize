// React core
import React, { Component, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// Home subcomponents
import AppNavbar from '../common/AppNavbar';
// Services and redux action
import { UserAction } from '../../actions';
import { ApiService } from '../../services';

class Home extends Component {

  constructor(props) {
    // Inherit constructor
    super(props);
    // State for form data and error message
    this.state = {
      form: {
        plate_number: '',
      },
      vehicles: [],
      error: '',
    }

    //Bind functions
    this.loadVehicles = this.loadVehicles.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    //Init
    this.loadVehicles();
  }

  loadVehicles() {
    return ApiService.fetchVehicleList()
      .then(vehicles => {
        this.setState({ vehicles })
      });
  }

  handleChange(event) {
    const { name, value } = event.target;
    const { form } = this.state

    this.setState({
      form: {
        ...form,
        [name]: value,
      }
    });
  }

  handleSubmit(event) {
    //Suppress the default submit behavior
    event.preventDefault();

    // Extract `form` state
    const { form } = this.state;
    // Extract `setUser` of `UserAction` and `user.name` of UserReducer from redux
    const { addPlate } = this.props;

    return ApiService.addNewVehicle(form)
      .then(() => {
        addPlate(form);
        this.loadVehicles();
      })
      .catch(err => {
        this.setState({ error: err.toString() });
      });
  }

  handleDelete(event, plate_number) {
    //Suppress the default submit behavior
    event.preventDefault();

    // Extract `form` state
    // Extract `setUser` of `UserAction` and `user.name` of UserReducer from redux
    const { deletePlate } = this.props;
    const form = { plate_number };

    return ApiService.deleteVehicle(form)
      .then(() => {
        deletePlate(form);
        this.loadVehicles();
      })
      .catch(err => {
        this.setState({ error: err.toString() });
      });
  }

  render() {
    const { form, error, vehicles } = this.state;

    return (
      <React.Fragment>
        <AppNavbar />
        <section className="jumbotron text-center">
          <div className="container">
            <h2 className="jumbotron-heading">Get Started</h2>
            <p className="lead text-muted">Creating some record of vehicle you want to be put into EOS blockchain.</p>
            <form className="form-inline" onSubmit={ this.handleSubmit }>
              <input
                className="form-control"
                type="text"
                name="plate_number"
                value={ form.plate_number }
                placeholder="Plate Number"
                onChange={ this.handleChange }
              />
              <button type="submit" className="btn btn-black">Add New Vehicle</button>
            </form>
            <div>
              {error && <span className="text-danger">{error}</span>}
            </div>
          </div>
        </section>

        <div className="album text-muted">
          <div className="container">
            <div className="row">
              {
                vehicles.map(vehicle => (
                  <div className="card" key={ vehicle.id }>
                    <h1>
                      <Link to={`/detail/${vehicle.plate_number}`}>
                        { vehicle.plate_number.toUpperCase() }
                      </Link>
                    </h1>
                    <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                    <button className="btn btn-black" onClick={(e) => this.handleDelete(e, vehicle.plate_number) }>Delete</button>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }

}

// Map all state to component props (for redux to connect)
const mapStateToProps = state => state;

// Map the following action to props
const mapDispatchToProps = {
  setUser: UserAction.setUser,
  addPlate: UserAction.add_plate,
  deletePlate: UserAction.delete_plate,
};

// Export a redux connected component
export default connect(mapStateToProps, mapDispatchToProps)(Home);
