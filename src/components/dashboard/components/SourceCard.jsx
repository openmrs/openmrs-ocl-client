import React from 'react';

const SourceCard = (source) => {
  const {
    source: {
      name,
      url,
      versions_url,
      owner,
      owner_type,
      source_type,
      active_concepts,
      versions,
      owner_url,
    },
  } = source;
  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 p-3">
      <div className="card-container">
        <div className="source-card-body">
          <div className="float-created-at">
            <a href={`https://www.openconceptlab.com${owner_url}`} className="source-owner-name">
              {owner} <small>({owner_type})</small>
            </a>
          </div>
          <div className="source-name col-12 mt-3">
            <a href={`https://www.openconceptlab.com${url}`}>
              <h6 className="text-left">{name}</h6>
            </a>
          </div>
          <div className="description col-12 text-left">
            <p>
              <a href={`/dashboard/concepts/${owner_type}/${owner}/${name}`} className="source-type">
                {active_concepts} concepts,
              </a>{' '}
              <a href={`https://www.openconceptlab.com${versions_url}`} className="source-type">
                Version {versions}
              </a>
            </p>
          </div>
        </div>
        <div className="source-card-footer">
          <div className="avatar col-12">
            Source type: <span className="d-inline ml-1">{source_type || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SourceCard;
