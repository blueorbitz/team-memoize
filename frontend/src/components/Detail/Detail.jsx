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
    }
  }

  render() {
    console.log(this.props, this.state);
    return (
      <React.Fragment>
        <AppNavbar />

        <div className="container">
          <h3>Vehicle Info</h3>
          <form>
            <div className="form-group row">
              <label className="col-sm-3 col-form-label">Chasis Number</label>
              <div className="col-sm-9">
                <input type="text" className="form-control" placeholder="Chasis serial number" />
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-3 col-form-label">Manufacture Date</label>
              <div className="col-sm-9">
                <input type="date" className="form-control" />
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-3 col-form-label">Ownership Date</label>
              <div className="col-sm-9">
                <input type="date" className="form-control" />
              </div>
            </div>
            <button className="btn pull-right ml-2">Cancel</button>
            <button type="submit" className="btn btn-black pull-right">Update</button>
          </form>
        </div>

        <div className="container next-section">
          <h3>Service Info</h3>
          <form>
            <div className="form-group row">
              <label className="col-sm-3 col-form-label">Service Date</label>
              <div className="col-sm-9">
                <input type="date" className="form-control" />
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-3 col-form-label">Memo</label>
              <div className="col-sm-9">
                <textarea type="text" className="form-control" rows="3" />
              </div>
            </div>
            <button type="submit" className="btn btn-black pull-right">Add New</button>
          </form>
        </div>

        <div className="container next-section">
          <ul className="list-group">
            <li className="list-group-item">Cras justo odio</li>
            <li className="list-group-item">Dapibus ac facilisis in</li>
            <li className="list-group-item">Morbi leo risus</li>
            <li className="list-group-item">Porta ac consectetur ac</li>
            <li className="list-group-item">Vestibulum at eros</li>
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
};

// Export a redux connected component
export default connect(mapStateToProps, mapDispatchToProps)(Detail);
