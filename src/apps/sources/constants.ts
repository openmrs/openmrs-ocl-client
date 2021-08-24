import { TabType } from "../containers/types";

export const OCL_SOURCE_TYPE = "Dictionary";

export const TAB_LIST: TabType[] = [
  {
    labelName: "My Sources",
    labelURL: "/user/sources/"
  },
  {
    labelName: "Your Organizations' Sources",
    labelURL: "/user/orgs/sources/"
  },
  {
    labelName: "All Public Concepts",
    labelURL: "/sources/"
  }
];

export const PER_PAGE = 20;
export const TITLE = "Sources";
