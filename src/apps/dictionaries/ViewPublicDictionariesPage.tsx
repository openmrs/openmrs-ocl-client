import React, { useEffect } from "react";
import { AppState } from "../../redux";
import {
  retrievePublicDictionariesAction,
  retrievePublicDictionariesLoadingSelector
} from "./redux";
import { connect } from "react-redux";
import { APIDictionary } from "./types";
import { ProgressOverlay } from "../../utils/components";
import { useQuery } from "../../utils";
import { useHistory, useLocation } from "react-router";
import qs from "qs";
import ViewDictionaries from "./components/ViewDictionaries";

const PER_PAGE = 20;

interface Props {
  loading: boolean;
  dictionaries?: APIDictionary[];
  meta?: { num_found?: number };
  retrieveDictionaries: Function;
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
    retrieveDictionaries("/collections/", initialQ, PER_PAGE, page);
  }, [retrieveDictionaries, initialQ, page]);

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
    </ProgressOverlay>
  );
};

const mapStateToProps = (state: AppState) => ({
  loading: retrievePublicDictionariesLoadingSelector(state),
  dictionaries: state.dictionaries.dictionaries[0]?.items,
  meta: state.dictionaries.dictionaries[0]?.responseMeta
});

const mapDispatchToProps = {
  retrieveDictionaries: retrievePublicDictionariesAction
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewPublicDictionariesPage);
