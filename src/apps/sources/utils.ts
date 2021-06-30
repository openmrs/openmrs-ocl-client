export const getSourceTypeFromPreviousPath = (previousPath: String) => {
  switch (previousPath) {
    case "/sources/":
      return "All Public Concepts";
    case "/user/sources/":
      return "Your Sources";
    case "/user/orgs/sources/":
      return "Your Organisations' Sources";
    default:
      return "Sources";
  }
};
