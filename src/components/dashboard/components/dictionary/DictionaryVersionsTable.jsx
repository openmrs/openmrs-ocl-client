import React from 'react';
import { Link } from 'react-router-dom';

const DictionaryVersionsTable = (version) => {
  const {
    version: {
      id,
      updated_on,
      version_url,
    }, showSubModal, download,
  } = version;
  const DATE_OPTIONS = {
    weekday: 'long', year: 'numeric', month: 'short', day: 'numeric',
  };
  return (
    <tr id="versiontable">
      <td>{id === 'HEAD' ? 'Latest' : id}</td>
      <td>{ (new Date(updated_on)).toLocaleDateString('en-US', DATE_OPTIONS)}</td>
      <td>
        <a className="btn btn-sm" href={version_url}>Browse in OCL</a>
        {' '}
        <Link className="downloadConcepts btn btn-sm" onClick={download} to="#">Download</Link>
        {' '}
        <Link className="subscription-link btn btn-sm" onClick={() => { showSubModal(version_url); }} to="#">
          Subscription URL
        </Link>
      </td>
    </tr>
  );
};
export default DictionaryVersionsTable;
