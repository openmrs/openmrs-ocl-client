import React, { useEffect } from "react";
import { APIDictionary } from "../types";
import { ProgressOverlay } from "../../../utils/components";
import { generateURLWithQueryParams, useQueryParams } from "../../../utils";
import { useHistory, useLocation } from "react-router";
import ViewDictionaries from "../components/ViewDictionaries";
import {
  retrievePublicDictionariesAction,
  toggleShowVerifiedAction
} from "../redux";
import { Fab, Tooltip } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { ContainerOwnerTabs } from "../../containers/components";
import { Header } from "../../../components";
import { TAB_LIST, PER_PAGE, TITLE } from "../constants";

interface Props {
  loading: boolean;
  dictionaries?: APIDictionary[];
  meta?: { num_found?: number };
  // not nice, but better than not typing it
  retrieveDictionaries: (
    ...args: Parameters<typeof retrievePublicDictionariesAction>
  ) => void;
  toggleShowVerified: (
    ...args: Parameters<typeof toggleShowVerifiedAction>
  ) => void;
  showOnlyVerified: boolean;
}
const ViewPublicDictionariesPage: React.FC<Props> = ({
  dictionaries = [],
  loading,
  meta = {},
  retrieveDictionaries,
  toggleShowVerified,
  showOnlyVerified
}) => {
  const { push: goTo } = useHistory();
  const { pathname: url } = useLocation();
  const { num_found: numFound = dictionaries.length } = meta;

  const queryParams: { page?: number; q?: string } = useQueryParams();
  const { page = 1, q: initialQ = "" } = queryParams;

  useEffect(() => {
    retrieveDictionaries(
      url,
      showOnlyVerified ? "CIEL" : initialQ,
      PER_PAGE,
      page
    );
  }, [retrieveDictionaries, url, initialQ, page, showOnlyVerified]);

  const changePage = (params: { page?: number; q?: string }) => {
    const targetURL = generateURLWithQueryParams(url, params, queryParams);
    goTo(targetURL);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    })
  }

  return (
    <Header title="Dictionaries">
      <ContainerOwnerTabs currentPageUrl={url} tabList={TAB_LIST} />
      <ProgressOverlay loading={loading}>
        <ViewDictionaries
          initialQ={initialQ}
          page={page}
          perPage={PER_PAGE}
          onSearch={(q: string) => changePage({ q })}
          onPageChange={(page: number) => changePage({ page })}
          dictionaries={dictionaries}
          numFound={numFound}
          title={TITLE}
          showOnlyVerified={showOnlyVerified}
          toggleShowVerified={toggleShowVerified}
        />
        <Link to={`/collections/new/`}>
          <Tooltip data-testid="createNewDictionary" title="Create new dictionary" style={{ zIndex: 3 }}>
            <Fab color="primary" className="fab">
              <AddIcon />
            </Fab>
          </Tooltip>
        </Link>
      </ProgressOverlay>
    </Header>
  );
};

export default ViewPublicDictionariesPage;
