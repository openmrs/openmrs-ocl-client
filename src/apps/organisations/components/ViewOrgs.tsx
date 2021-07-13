import React from "react";
import { BaseAPIOrganisation } from "../types";
import {
  ContainerSearch,
  ContainerPagination
} from "../../containers/components";
import OrganisationCards from "./OrgCards";
interface Props {
  organisations: BaseAPIOrganisation[];
  title: string;
  onSearch: Function;
  initialQ: string;
  page: number;
  perPage: number;
  numFound: number;
  onPageChange: Function;
  showOnlyVerified: boolean;
  toggleShowVerified: () => void;
}

const ViewOrganisations: React.FC<Props> = ({
  organisations,
  title,
  onSearch,
  initialQ,
  page,
  perPage,
  numFound,
  onPageChange,
  showOnlyVerified,
  toggleShowVerified
}) => {
  return (
    <>
      <ContainerSearch
        title={title}
        onSearch={onSearch}
        initialQ={initialQ}
        showOnlyVerified={showOnlyVerified}
        toggleShowVerified={toggleShowVerified}
      />
      <OrganisationCards cards={organisations} title="Organisations" />
      <ContainerPagination
        num_found={Number(numFound)}
        per_page={Number(perPage)}
        page={page}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default ViewOrganisations;
