import qs from "qs";

type QueryParams = { [key: string]: string | number }

export const generateURLWithQueryParams = (
    currentBaseUrl: string,
    params: QueryParams,
    currentQueryParams?: QueryParams
) => {
    const newParams: QueryParams = {
        ...currentQueryParams,
        ...params
    };
    return `${currentBaseUrl}?${qs.stringify(newParams)}`;
};
