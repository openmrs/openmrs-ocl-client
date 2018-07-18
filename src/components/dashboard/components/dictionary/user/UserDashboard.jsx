import React from 'react';
import { Alert } from 'react-bootstrap';

const UserDashboard = ({ viewState, organizations }) => {
  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-1" />
        <div className="col-sm-12 col-md-10  mt-2 col-12" id="userInfo">
          <Alert className="dashboard-alert">
            <h6>
              Hello {localStorage.getItem('username')} 👋, you belong to{' '}
              <strong>
                {' '}
                {organizations &&
                  organizations.map(organization => (
                    <span value={organization.id} key={organization.id}>
                      {organization.id}
                      {', '}
                    </span>
                  ))}
              </strong>
              organization(s).
            </h6>
            <span> You are viewing {viewState === 'user' ? 'your' : 'all openmrs' } <strong>  {viewState} </strong> dictionaries</span>
            <span> {''} </span>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
