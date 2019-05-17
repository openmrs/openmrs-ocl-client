import React from 'react';
import PropTypes from 'prop-types';
import { includes } from 'lodash';
import SideNavItems from './SideNavItems';

const Sidenav = (props) => {
  const {
    classes, datatypes, datatypeInput, classInput, handleChange, datatypeList, classList,
  } = props;
  return (
    <div className="col-12 col-md-3 custom-full-width">
      <div className="sidenav-container">
        <div className="row">
          <h6 className="sidenav-header">Datatypes</h6>
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
          <h6 className="sidenav-header">Classes</h6>
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
};

Sidenav.defaultProps = {
  datatypeInput: '',
  classInput: '',
  datatypeList: [],
  classList: [],
};

export default Sidenav;
