import React from 'react';

const footer = () => (
  <div className="footer">
    <div className="site-footer">
      <ul className="site-footer-links float-left">
        <li>
            &copy;
            &nbsp;
          { new Date().getFullYear() }
          &nbsp;
        Open Concept Lab
        </li>
        <li><a href="https://qa.openconceptlab.org/license/">License</a></li>
        <li><a href="http://github.com/OpenConceptLab/oclapi/wiki" target="_blank" rel="noopener noreferrer">API</a></li>
        <li><a href="https://qa.openconceptlab.org/about/">About</a></li>
      </ul>
    </div>
  </div>
);

export default footer;
