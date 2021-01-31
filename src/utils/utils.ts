import { LOCALES } from "./constants";
import { snakeCase } from "lodash";

export const findLocale = (localeCode: string, fallback = "en") =>
  LOCALES.find(currentLocale => currentLocale.value === localeCode) ||
  (LOCALES.find(currentLocale => currentLocale.value === fallback) as {
    [key: string]: string;
  });

export const STATUS_CODES_TO_MESSAGES: { [key: number]: string } = {
  // if this map starts growing big, try to find more standardized language
  403: "You don't have permission to do this",
  404: "Could not find that resource"
};

const MESSAGES_TO_STATUS_CODES: { [key: string]: number } = Object.entries(
  // todo reformat this to use lodash's invert
  STATUS_CODES_TO_MESSAGES
).reduce<{ [key: string]: number }>(
  (result, [key, value]) => ({ ...result, [value]: parseInt(key) }),
  {}
);

export const getPrettyError = (
  errors: { [key: string]: string[] | undefined } | undefined | string,
  field?: string
) => {
  if (!errors) return;

  if (typeof errors === "string") return field ? undefined : errors;

  const errorList: string[] | undefined = field
    ? errors[field]
    : errors["__all__"];
  if (!errorList) return;

  return errorList.join(", ");
};

export function getCustomErrorMessage(
  errorMessage: string | undefined,
  statusCodesWeCareAbout: { [key: number]: string }
) {
  const statusCode = errorMessage
    ? MESSAGES_TO_STATUS_CODES[errorMessage]
    : undefined;
  const statusMessage = statusCode
    ? statusCodesWeCareAbout[statusCode]
    : undefined;
  return statusMessage || errorMessage;
}

export const keysToSnakeCase = (item?: any) => {
  const isArray = (a: any) => {
    return Array.isArray(a);
  };

  const isObject = (o: any) => {
    return o === Object(o) && !isArray(o) && typeof o !== "function";
  };

  if (isObject(item)) {
    const newItem: { [key: string]: any } = {};

    Object.keys(item).forEach(k => {
      newItem[snakeCase(k)] = keysToSnakeCase(item[k]);
    });

    return newItem;
  } else if (isArray(item)) {
    return item.map((i: any) => {
      return keysToSnakeCase(i);
    });
  }

  return item;
};

export const buildPartialSearchQuery = (query: string): string =>
  `${query.replace(new RegExp(" ", "g"), "* ")}*`;

export const delay = (seconds: number) =>
  new Promise(resolve => setTimeout(resolve, seconds * 1000));

export function debug(...messages: string[]) {
  console.log(messages);
}

type Order = 'asc' | 'desc';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
}

export function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export const getDate = (date: any) => {
  if (typeof date === 'object') {
    const isoDate = date.toISOString();
    return isoDate.substr(0, isoDate.indexOf('T'));
  }
  return typeof date === 'string' ? date.substr(0, date.indexOf('T')) : date;
};
