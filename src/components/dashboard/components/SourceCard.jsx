import React from 'react';
import Avatar from 'react-avatar';
import moment from 'moment';
import ReactTooltip from 'react-tooltip';

const SourceCard = (source) => {
  const {
    source: {
      name,
      url,
      versions_url,
      concepts_url,
      owner,
      updated_on,
      source_type,
      active_concepts,
      active_mappings,
      versions,
    },
  } = source;
  return (
    <div className="row justify-content-center ">
      <div className="col-1 d-none d-lg-block d-xl-block d-md-block" />
      <div className="col-10 mt-2 item-list pt-3">
        <div className="row list-body">
          <div className="col col-sm-2 col-md-1">
            <Avatar name={source_type} round size={50} />
          </div>
          <div className="source-name ml-3 col-sm-6 col">
            <h6>
              <a href={`https://www.openconceptlab.com${url}`} className="name-url">
                {owner} / <span className="font-weight-bold">{name}</span>
              </a>
            </h6>
            <p className="description col">
              Source type: <span className="text-monospace">{source_type}</span>
            </p>
            <p className="update-time col">
              Last updated on{' '}
              <span className="text-monospace">{moment(updated_on).format('L')}</span>
            </p>
          </div>
          <div className="col key-icons d-none d-lg-block d-xl-block d-md-block">
            <a href={`https://www.openconceptlab.com${concepts_url}`} data-tip="active concepts">
              <i className="fas fa-tag" />
              {active_concepts}
            </a>
            <a href="#!" data-tip="active mappings">
              <i className="fas fa-link" />
              {active_mappings}
            </a>
            <a href={`https://www.openconceptlab.com${versions_url}`} data-tip="versions">
              <i className="fas fa-asterisk" />
              {versions}
            </a>
          </div>
        </div>
      </div>
      <ReactTooltip />
    </div>
  );
};

export default SourceCard;
