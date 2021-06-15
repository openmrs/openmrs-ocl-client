import { Store } from "redux";
import { AppState } from "../src/redux/types";

export const getStore = (): Store<AppState> => window.store;
export const currentUser = (): string =>
  getStore().getState().auth.profile?.username || "admin";
