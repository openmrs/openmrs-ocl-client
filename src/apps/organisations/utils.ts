export const getOrganisationTypeFromPreviousPath = (previousPath: String) => {
    switch (previousPath) {
        case '/orgs/':
            return 'Public Organisations';
        case '/user/orgs/':
            return 'Your Organisations';
        default:
            return 'Organisations'
    }
};
