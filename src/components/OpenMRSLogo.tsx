import React from 'react';

const OpenMRSLogo: React.FC<React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
  >> = () => {
  return (
      <img src="/omrs-logo.svg"  alt={"openmrs"} style={{width:"20px"}} />
  );
};
export default OpenMRSLogo;
