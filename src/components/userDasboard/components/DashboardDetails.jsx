import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const DashboardDetails = ({ numberOfOrgs, numberOfDictionary, organizations }) => {
  const nameOfOrganizations = organizations.map(organization => organization.name).join(',');
  const dictionary = numberOfDictionary === 1 ? 'dictionary' : 'dictionaries';
  if (numberOfOrgs === 1) {
    return (
      <div className="user-data">
        <p className="lead">
          You belong to {nameOfOrganizations} organization. This can be changed via{' '}
          <a href="https://qa.openconceptlab.org/" target="_blank" rel="noopener noreferrer">
            the traditional OCL
          </a>.
        </p>
        <p className="lead">
          You can <Link to="dashboard/dictionaries">view all OpenMRS public dictionaries</Link>.
        </p>
      </div>
    );
  } else if (numberOfOrgs > 1) {
    return (
      <div className="user-data">
        <p className="lead">
          You belong to {numberOfOrgs} organizations:{' '}
          {organizations.map(organization => (
            <span className="d-block lead org-name text-capitalize" key={organization.id}>
              <a
                href={`https://qa.openconceptlab.org${organization.url}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fas fa-arrow-circle-right fa-fw" /> {organization.name}
              </a>
            </span>
          ))}{' '}
          This can be changed via{' '}
          <a href="https://qa.openconceptlab.org/" target="_blank" rel="noopener noreferrer">
            the traditional OCL
          </a>.
        </p>
        <p className="lead">
          You can <Link to="dashboard/dictionaries">view all OpenMRS public dictionaries</Link>.
        </p>
      </div>
    );
  }
  return (
    <div className="user-data">
      <p className="lead">
        You do not belong to any organization. This can be changed via{' '}
        <a href="https://qa.openconceptlab.org/" target="_blank" rel="noopener noreferrer">
          the traditional OCL
        </a>.
      </p>
      <p className="lead">
        You currently have {numberOfDictionary} personal {dictionary}. You can{' '}
        <Link to="dashboard/dictionaries">view all OpenMRS public dictionaries</Link>.
      </p>
    </div>
  );
};

DashboardDetails.propTypes = {
  numberOfOrgs: PropTypes.number.isRequired,
  numberOfDictionary: PropTypes.number.isRequired,
  organizations: PropTypes.array.isRequired,
};

export default DashboardDetails;
