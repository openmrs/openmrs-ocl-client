import React from 'react';
import PropTypes from 'prop-types';

const DashboardDetails = ({ numberOfOrgs, numberOfDictionary, organizations }) => {
  const nameOfOrganizations = organizations.map(organization => organization.name).join(',');
  const dictionary = numberOfDictionary === 1 ? 'dictionary' : 'dictionaries';
  if (numberOfOrgs === 1) {
    return (
      <div className="user-data">
        <p className="lead">
          <span>
            You belong to
            {' '}
            {nameOfOrganizations}
            {' '}
organization. This can be changed via
            {' '}
            <a href="https://qa.openconceptlab.org/" target="_blank" rel="noopener noreferrer">
            the traditional OCL
            </a>
.
          </span>
        </p>
      </div>
    );
  }
  if (numberOfOrgs > 1) {
    return (
      <div className="user-data">
        <p className="lead">
          <span>
            You belong to
            {' '}
            {numberOfOrgs}
            {' '}
organizations:
            {' '}
          </span>
          <br />
          {organizations.map(organization => (
            <span className="lead org-name text-capitalize" key={organization.id}>
              <a
                href={`https://qa.openconceptlab.org${organization.url}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fas fa-arrow-circle-right fa-fw" />
                {' '}
                {organization.name}
              </a>
            </span>
          ))}
          {' '}
          <span className="d-block">
          This can be changed via
            {' '}
            <a href="https://qa.openconceptlab.org/" target="_blank" rel="noopener noreferrer">
            the traditional OCL
            </a>
.
          </span>
        </p>
      </div>
    );
  }
  return (
    <div className="user-data">
      <span>
        <p className="lead">
        You do not belong to any organization. This can be changed via
          {' '}
          <a href="https://qa.openconceptlab.org/" target="_blank" rel="noopener noreferrer">
          the traditional OCL
          </a>
.
        </p>
        <p className="lead">
        You currently have
          {' '}
          {numberOfDictionary}
          {' '}
personal
          {' '}
          {dictionary}
.
        </p>
      </span>
    </div>
  );
};

DashboardDetails.propTypes = {
  numberOfOrgs: PropTypes.number.isRequired,
  numberOfDictionary: PropTypes.number.isRequired,
  organizations: PropTypes.array.isRequired,
};

export default DashboardDetails;
