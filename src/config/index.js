export default {
  OCL_API_HOST: (process.env && process.env.REACT_APP_OCL_API_HOST) || 'https://api.qa.openconceptlab.org/',
  TRADITIONAL_OCL: (process.env && process.env.REACT_APP_TRADITIONAL_OCL_HOST) || 'https://qa.openconceptlab.org',
};
