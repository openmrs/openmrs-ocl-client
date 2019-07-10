import React from 'react';
import PropTypes from 'prop-types';
import { includes } from 'lodash';
import { Button } from 'reactstrap';
import SideNavItems from './SideNavItems';
import { FILTER_TYPES } from '../../../constants';

const Sidenav = (props) => {
  const {
    classes,
    datatypes,
    datatypeInput,
    classInput,
    handleChange,
    datatypeList,
    classList,
    clearAllBulkFilters,
  } = props;
  return (
    <div className="col-12 col-md-3 custom-full-width">
      <div className="sidenav-container">
        <div className="row">
          <h5 className="sidenav-header">
            Datatypes
            {datatypes.length > 0 ? (
              <Button id="clear-datatype-filters" onClick={() => clearAllBulkFilters(FILTER_TYPES.DATATYPE)} className="btn btn-sm btn-outline-secondary clear-filter-button">Clear all</Button>
            ) : ('')}
          </h5>
        </div>
        {datatypes.map(datatype => (
          <SideNavItems
            listItem={datatype}
            key={datatype}
            filterType="datatype"
            value={datatypeInput}
            handleChange={handleChange}
            isChecked={includes(datatypeList, datatype)}
          />
        ))}
        <div className="row mt-3">
          <h5 className="sidenav-header">
            Classes
            {classes.length > 0 ? (
              <Button id="clear-class-filters" onClick={() => clearAllBulkFilters(FILTER_TYPES.CLASSES)} className="btn btn-sm btn-outline-secondary clear-filter-button">Clear all</Button>
            ) : ('')}
          </h5>
        </div>
        {classes.map(classItem => (
          <SideNavItems
            listItem={classItem}
            key={classItem}
            filterType="classes"
            value={classInput}
            handleChange={handleChange}
            isChecked={includes(classList, classItem)}
          />
        ))}
      </div>
    </div>
  );
};

Sidenav.propTypes = {
  classes: PropTypes.array.isRequired,
  datatypes: PropTypes.array.isRequired,
  datatypeInput: PropTypes.string,
  classInput: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  datatypeList: PropTypes.array,
  classList: PropTypes.array,
  clearAllBulkFilters: PropTypes.func,
};

Sidenav.defaultProps = {
  datatypeInput: '',
  classInput: '',
  datatypeList: [],
  classList: [],
  clearAllBulkFilters: () => {},
};

export default Sidenav;
