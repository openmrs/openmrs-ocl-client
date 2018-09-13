import React from 'react';
import './styles/dictionary-modal.css';

const DictionaryVersionsTable = (version) => {
  const {
    version: {
      id,
      updated_on,
      version_url,
    },
  } = version;
  const DATE_OPTIONS = {
    weekday: 'long', year: 'numeric', month: 'short', day: 'numeric',
  };

  return (
    <tr id="versiontable">
      <td>{id}</td>
      <td>{ (new Date(updated_on)).toLocaleDateString('en-US', DATE_OPTIONS)}</td>
      <td>Yes</td>
      <td><a href={version_url} >Browse in OCL</a> <a href="a">Subscription URL</a></td>
    </tr>
  );
};
export default DictionaryVersionsTable;
