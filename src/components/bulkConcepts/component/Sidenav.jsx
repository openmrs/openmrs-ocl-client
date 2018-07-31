import React from 'react';

const Sidenav = () => (
  <div className="col-12 col-md-3">
    <div className="sidenav-container">
      <div className="row">
        <h6 className="sidenav-header">Classes</h6>
      </div>
      <div className="custom-control custom-checkbox">
        <input type="checkbox" className="custom-control-input" />
        <label className="custom-control-label bulk-concept-label" htmlFor="test">
          lorem
        </label>
      </div>
      <div className="row mt-3">
        <h6 className="sidenav-header">Datatype</h6>
      </div>
      <div className="custom-control custom-checkbox">
        <input type="checkbox" className="custom-control-input" />
        <label className="custom-control-label bulk-concept-label" htmlFor="test">
          lorem
        </label>
      </div>
    </div>
  </div>
);

export default Sidenav;
