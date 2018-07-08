import React from 'react';
import './styles/dictionary-modal.css';

const DictionaryDetailCard = (dictionary) => {
  const {
    dictionary: {
      name, created_on, updated_on, public_access, owner, owner_type, active_concepts, description,
    },
  } = dictionary;

  return (<div className="dictionaryDetails">
    <div className="card">
      <div className="card-header" id="headerDict">
        <h1 id="headingDict">{ name }</h1>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-6">
            <h3 className="genCon">General Details</h3>
            <p className="paragraph">Public Access: { public_access }</p>
            <p className="paragraph">Owner: { owner }({ owner_type })</p>
            <p className="paragraph">Created On: { created_on }</p>
            <p className="paragraph">Updated On: { updated_on }</p>
          </div>
          <div className="col-6" id="rightside-detail">
            <h3 className="genCon">Concept Details</h3>
            <p className="paragraph">Total Concepts: { active_concepts }</p>
            <button type="button" className="btn btn-secondary" id="conceptB">
                Go to concepts
            </button>
          </div>
        </div>
        <div className="row"><h3 id="descHd">Description</h3></div>
        <div className="row">
          <div className="card" id="descriptionCard">
            { description ?
              (<div className="card-body">
                <p className="card-text" id="param">
                  { description }
                </p>
              </div>) : (
                <div className="card-body">
                  <p className="card-text" id="param">
                No Description
                  </p>
                </div>)
            }
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default DictionaryDetailCard;
