import React from 'react';

const OpenMRSLogo: React.FC<React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
  >> = () => {
  return (
      <img src="/openmrs_logo_white.gif"  alt={"openmrs"} style={{width:"30px"}} />
  );
};
export default OpenMRSLogo;
