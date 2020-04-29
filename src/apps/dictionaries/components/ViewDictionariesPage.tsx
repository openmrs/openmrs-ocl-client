import React, { useEffect } from "react";
import { APIDictionary } from "../types";
import { ProgressOverlay } from "../../../utils/components";
import { useQuery } from "../../../utils";
import { useHistory, useLocation } from "react-router";
import qs from "qs";
import ViewDictionaries from "../components/ViewDictionaries";
import { retrievePublicDictionariesAction } from "../redux";
import { Fab, Tooltip } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import { Link } from "react-router-dom";

const PER_PAGE = 20;

interface Props {
  loading: boolean;
  dictionaries?: APIDictionary[];
  meta?: { num_found?: number };
  // not nice, but better than not typing it
  retrieveDictionaries: (
    ...args: Parameters<typeof retrievePublicDictionariesAction>
  ) => void;
}

const ViewPublicDictionariesPage: React.FC<Props> = ({
  dictionaries = [],
  loading,
  meta = {},
  retrieveDictionaries
}) => {
  const { push: goTo } = useHistory();
  const { pathname: url } = useLocation();
  const { num_found: numFound = dictionaries.length } = meta;

  const queryParams: { page?: number; q?: string } = useQuery();
  const { page = 1, q: initialQ = "" } = queryParams;

  useEffect(() => {
    retrieveDictionaries(url, initialQ, PER_PAGE, page);
  }, [retrieveDictionaries, url, initialQ, page]);

  const gimmeAUrl = (params: { page?: number; q?: string }) => {
    const newParams: { page?: number; q?: string } = {
      ...queryParams,
      ...params
    };
    return `${url}?${qs.stringify(newParams)}`;
  };

  return (
    <ProgressOverlay loading={loading}>
      <ViewDictionaries
        initialQ={initialQ}
        page={page}
        onSearch={(q: string) => goTo(gimmeAUrl({ q }))}
        onPageChange={(page: number) => goTo(gimmeAUrl({ page }))}
        dictionaries={dictionaries}
        numFound={numFound}
      />
      <Link to={`/collections/new/`}>
        <Tooltip title="Create new dictionary">
          <Fab color="primary" className="fab">
            <AddIcon />
          </Fab>
        </Tooltip>
      </Link>
    </ProgressOverlay>
  );
};

export default ViewPublicDictionariesPage;
