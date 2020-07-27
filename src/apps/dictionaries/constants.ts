import { TabType } from "../containers/types";

export const CONTEXT = {
  create: "create",
  view: "view",
  edit: "edit",
};

export const TAB_LIST: TabType[] = [
  {
    labelName: "Public Dictionaries",
    labelURL: "/collections/",
  },
  {
    labelName: "Your Dictionaries",
    labelURL: "/user/collections/",
  },
  {
    labelName: "Your Organizations' Dictionaries",
    labelURL: "/user/orgs/collections/",
  },
];

export const PER_PAGE = 20;
export const TITLE = "Dictionaries";
