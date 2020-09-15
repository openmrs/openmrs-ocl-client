export interface APIProfile {
  username: string;
  name?: string;
  url?: string;
  organizations_url?: string;
  email: string;
  company?: string;
  location?: string;
  created_on?: string;
}

export interface APIOrg {
  id: string;
  name: string;
  url: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  token?: string;
  profile?: APIProfile;
  orgs?: APIOrg[];
}

export {};
