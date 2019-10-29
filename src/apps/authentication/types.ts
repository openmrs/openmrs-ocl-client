export interface APIProfile {
    username: string,
    url: string,
    organizations_url: string,
    email: string,
}

export interface APIOrg {
    id: string,
    name: string,
    url: string,
}

export interface AuthState {
    isLoggedIn: boolean;
    token?: string;
    profile?: APIProfile;
    orgs?: APIOrg[];
}

export {};
