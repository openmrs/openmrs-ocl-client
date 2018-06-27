import PropTypes from 'prop-types';

// eslint-disable-next-line
export const conceptsProps = {
  id: PropTypes.string,
  external_id: PropTypes.string,
  concept_class: PropTypes.string,
  datatype: PropTypes.string,
  retired: PropTypes.bool,
  source: PropTypes.string,
  owner: PropTypes.string,
  owner_type: PropTypes.string,
  owner_url: PropTypes.string,
  display_name: PropTypes.string,
  display_locale: PropTypes.string,
  version: PropTypes.string,
  mappings: PropTypes.string,
  is_latest_version: PropTypes.bool,
  locale: PropTypes.string,
  version_url: PropTypes.string,
  url: PropTypes.string,
};
