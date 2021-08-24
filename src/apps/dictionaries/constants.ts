import { TabType } from "../containers/types";

export const TAB_LIST: TabType[] = [
  {
    labelName: "My Dictionaries",
    labelURL: "/user/collections/"
  },
  {
    labelName: "Your Organizations' Dictionaries",
    labelURL: "/user/orgs/collections/"
  },
  {
    labelName: "Public Dictionaries",
    labelURL: "/collections/"
  }
];

export const PER_PAGE = 20;
export const TITLE = "Dictionaries";
