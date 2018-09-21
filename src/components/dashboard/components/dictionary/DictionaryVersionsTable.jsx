import React from 'react';
import { Link } from 'react-router-dom';
import './styles/dictionary-modal.css';
import SubscriptionModal from '../dictionary/common/SubscriptionModal';

const DictionaryVersionsTable = (version) => {
  const {
    version: {
      id,
      updated_on,
      version_url,
    }, hide, show, showSubModal, url,
  } = version;
  const DATE_OPTIONS = {
    weekday: 'long', year: 'numeric', month: 'short', day: 'numeric',
  };
  return (
    <tr id="versiontable">
      <td>{id}</td>
      <td>{ (new Date(updated_on)).toLocaleDateString('en-US', DATE_OPTIONS)}</td>
      <td>Yes</td>
      <td><a href={version_url}>Browse in OCL</a> <Link className="subscription-link" onClick={() => { showSubModal(version_url); }} to="#">Subscription URL</Link></td>
      <SubscriptionModal
        show={show}
        click={hide}
        url={url}
      />
    </tr>
  );
};
export default DictionaryVersionsTable;
