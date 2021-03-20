// React core
import React, { Component, useEffect } from 'react';
import { connect } from 'react-redux';
// Detail subcomponents
import AppNavbar from '../common/AppNavbar';
// Services and redux action
import { UserAction } from '../../actions';
import { ApiService } from '../../services';

class Detail extends Component {

  constructor(props) {
    // Inherit constructor
    super(props);
    // State for form data and error message

    this.state = {
      vehicleForm: {
        chasis_sn: '',
        manufacture_date: '',
        ownership_date: '',
      },
      serviceForm: {
        service_date: '',
        memo: '',
      },
      vehicle: {},
      services: [],
      error: '',
    };
    
    //Bind functions
    this.loadInitial =  this.loadInitial.bind(this);
    this.loadVehicle = this.loadVehicle.bind(this);
    this.loadServices = this.loadServices.bind(this);
    this.handleVehicleChange = this.handleVehicleChange.bind(this);
    this.handleServiceChange = this.handleServiceChange.bind(this);
    this.handleVehicleSubmit = this.handleVehicleSubmit.bind(this);
    this.handleServiceSubmit = this.handleServiceSubmit.bind(this);
    this.handleServiceDelete = this.handleServiceDelete.bind(this);

    // Init
    this.loadInitial();
  }

  async loadInitial() {
    await this.loadVehicle();
    await this.loadServices();
  }

  loadVehicle() {
    const { match: { params: { plate_number } } } = this.props;

    return ApiService.fetchVehicleList()
      .then(vehicles => {
        const vehicle = vehicles.filter(v => v.plate_number === plate_number)[0];
        // format string
        vehicle.manufacture_date = vehicle.manufacture_date.substr(0, 10);
        vehicle.ownership_date = vehicle.ownership_date.substr(0, 10);
        
        // set state
        this.setState({
          vehicle,
          vehicleForm: vehicle,
        });
      });
  }

  loadServices() {
    const { vehicle: { vehicle_id } } = this.props;
    return ApiService.fetchServiceRecords(vehicle_id)
      .then(services => {
        this.setState({ services });
      });
  }

  handleVehicleChange(event) {
    const { name, value } = event.target;
    const { vehicleForm } = this.state;

    this.setState({
      vehicleForm: {
        ...vehicleForm,
        [name]: value,
      }
    });
  }

  handleServiceChange(event) {
    const { name, value } = event.target;
    const { serviceForm } = this.state;

    this.setState({
      serviceForm: {
        ...serviceForm,
        [name]: value,
      }
    });
  }

  handleVehicleSubmit(event) {
    //Suppress the default submit behavior
    event.preventDefault();

    const { vehicleForm, vehicle } = this.state;
    const query = Object.assign({}, vehicle, vehicleForm);
    query.vehicle_id = query.id;

    return ApiService.updateVehicle(query)
      .then(() => this.loadVehicle())
      .catch(err => {
        this.setState({ error: err.toString() });
      });
  }

  handleServiceSubmit(event) {
    //Suppress the default submit behavior
    event.preventDefault();

    const { serviceForm, vehicle } = this.state;
    const query = Object.assign({}, serviceForm);
    query.vehicle_id = vehicle.id;

    return ApiService.addServiceRecord(query)
      .then(() => {
        this.setState({
          serviceForm: {
            service_date: '',
            memo: '',
          }
        });
      })
      .then(() => this.loadServices())
      .catch(err => {
        this.setState({ error: err.toString() });
      });
  }

  handleServiceDelete(event, service_id) {
    //Suppress the default submit behavior
    event.preventDefault();

    return ApiService.deleteServiceRecord({ service_id })
      .then(() => this.loadServices())
      .catch(err => {
        this.setState({ error: err.toString() });
      });
  }

  render() {
    const { vehicleForm, serviceForm, services, error } = this.state;

    return (
      <React.Fragment>
        <AppNavbar />

        <div>
          {error && <span className="text-danger">{error}</span>}
        </div>

        <div className="container">
          <h3>Vehicle Info</h3>
          <form onSubmit={ this.handleVehicleSubmit }>
            <div className="form-group row">
              <label className="col-sm-3 col-form-label">Chasis Number</label>
              <div className="col-sm-9">
                <input
                  type="text"
                  className="form-control"
                  name="chasis_sn"
                  value={ vehicleForm.chasis_sn }
                  placeholder="Chasis serial number"
                  onChange={ this.handleVehicleChange }
                />
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-3 col-form-label">Manufacture Date</label>
              <div className="col-sm-9">
                <input
                  type="date"
                  className="form-control"
                  name="manufacture_date"
                  value={ vehicleForm.manufacture_date }
                  onChange={ this.handleVehicleChange }
                />
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-3 col-form-label">Ownership Date</label>
              <div className="col-sm-9">
                <input
                  type="date"
                  className="form-control"
                  name="ownership_date"
                  value= {vehicleForm.ownership_date }
                  onChange={ this.handleVehicleChange }
                />
              </div>
            </div>
            <button className="btn pull-right ml-2">Cancel</button>
            <button type="submit" className="btn btn-black pull-right">Update</button>
          </form>
        </div>

        <div className="container next-section">
          <h3>Service Info</h3>
          <form onSubmit={ this.handleServiceSubmit }>
            <div className="form-group row">
              <label className="col-sm-3 col-form-label">Service Date</label>
              <div className="col-sm-9">
                <input type="date"
                  className="form-control"
                  name="service_date"
                  value= {serviceForm.service_date }
                  onChange={ this.handleServiceChange }
                />
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-3 col-form-label">Memo</label>
              <div className="col-sm-9">
                <textarea
                  type="text"
                  className="form-control"
                  rows="3"
                  name="memo"
                  value= {serviceForm.memo }
                  onChange={ this.handleServiceChange }
                />
              </div>
            </div>
            <button type="submit" className="btn btn-black pull-right">Add New</button>
          </form>
        </div>

        <div className="container next-section">
          <h3>Service Records</h3>
          <ul className="list-group">
            {
              services.reverse().map(service => {
                if (service.is_delete)
                  return null;

                return (
                  <li key={ ''+ service.id } className="list-group-item media">
                    <button
                      className="btn btn-sm btn-danger pull-right"
                      onClick={ (e) => this.handleServiceDelete(e, service.id) }
                    >
                      Delete
                    </button>
                    <h6 className="mr-3">{ service.service_date.substr(0, 10) }</h6>
                    <pre className="media-body">
                      { service.id }
                      { service.memo }
                    </pre>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </React.Fragment>
    )
  }

}

// Map all state to component props (for redux to connect)
const mapStateToProps = state => state;

// Map the following action to props
const mapDispatchToProps = {
  updateVehicle: UserAction.update_vehicle,
};

// Export a redux connected component
export default connect(mapStateToProps, mapDispatchToProps)(Detail);
