import React from 'react';
import { Link } from 'react-router-dom';
import SubscriptionModal from '../dictionary/common/SubscriptionModal';

const DictionaryVersionsTable = (version) => {
  const {
    version: {
      id,
      updated_on,
      version_url,
    }, hide, show, showSubModal, url, download,
  } = version;
  const DATE_OPTIONS = {
    weekday: 'long', year: 'numeric', month: 'short', day: 'numeric',
  };
  return (
    <tr id="versiontable">
      <td>{id}</td>
      <td>{ (new Date(updated_on)).toLocaleDateString('en-US', DATE_OPTIONS)}</td>
      <td><button type="button"><a href={version_url}>Browse in OCL</a></button><button type="button"><Link className="downloadConcepts" onClick={download} to="#">Download</Link></button><button type="button"><Link className="subscription-link" onClick={() => { showSubModal(version_url); }} to="#">Subscription URL</Link></button></td>
      <td className="d-none">
        <SubscriptionModal
          show={show}
          click={hide}
          url={url}
        />
      </td>
    </tr>
  );
};
export default DictionaryVersionsTable;
