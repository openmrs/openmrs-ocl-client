export const getLoggedInUsername = () => localStorage.getItem('username');
export const buildPartialSearchQuery = query => query.replace(new RegExp(' ', 'g'), '* ');
