import React from 'react';
import PropTypes from 'prop-types';

const NumericPrecision = (props) => {
  const {
    numericPrecisionOptions,
    handleChange,
  } = props;
  
  return (
    <div className="wrapper">
      
    <small className="form-text text-muted">(range values are inclusive)</small>

    <label htmlFor="hiAbsolute">Absolute High</label>
    <input 
    className="form-control" 
    name="hiAbsolute" 
    value={numericPrecisionOptions.hiAbsolute}
    type="number"
    onChange={handleChange}/>

    <label htmlFor="hiCritical">Critical High</label>
    <input 
    className="form-control" 
    name="hiCritical" 
    value={numericPrecisionOptions.hiCritical}
    type="number"
    onChange={handleChange}/>

    <label htmlFor="hiNormal">Normal High</label>
    <input 
    className="form-control" 
    name="hiNormal" 
    value={numericPrecisionOptions.hiNormal}
    type="number"
    onChange={handleChange}/>

    <label htmlFor="lowNormal">Normal Low</label>
    <input 
    className="form-control" 
    name="lowNormal" 
    value={numericPrecisionOptions.lowNormal}
    type="number"
    onChange={handleChange}/>

    <label htmlFor="lowCritical">Critical Low</label>
    <input 
    className="form-control" 
    name="lowCritical" 
    value={numericPrecisionOptions.lowCritical}
    type="number"
    onChange={handleChange}/>
    
    <label htmlFor="lowAbsolute">Absolute Low</label>
    <input 
    className="form-control" 
    name="lowAbsolute" 
    value={numericPrecisionOptions.lowAbsolute}
    type="number"
    onChange={handleChange}/>

    <label htmlFor="units">Units</label>
    <input 
    className="form-control" 
    name="units" 
    value={numericPrecisionOptions.units}
    type="text"
    onChange={handleChange}/>

    <label htmlFor="allowDecimal">Allow Decimal</label>
    <input 
    className="custom-control custom-checkbox" 
    type="checkbox"
    name="allowDecimal"
    checked={numericPrecisionOptions.allowDecimal}
    onChange={handleChange}/>

</div>
  );
};
NumericPrecision.propTypes = {
    handleChange: PropTypes.func.isRequired,
    numericPrecisionOptions:PropTypes.shape({
      numericEnabled: PropTypes.bool,
      hiAbsolute:PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      hiCritical:PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      hiNormal:PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      lowNormal:PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      lowCritical:PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      lowAbsolute:PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      units:PropTypes.string,
      allowDecimal: PropTypes.bool,
    }).isRequired,
};

export default NumericPrecision;
