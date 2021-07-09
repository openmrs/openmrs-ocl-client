import React from "react";
import { APISource } from "../types";
import {
  ContainerCards,
  ContainerPagination,
  ContainerSearch
} from "../../containers/components";

interface Props {
  sources: APISource[];
  numFound: number;
  onPageChange: Function;
  onSearch: Function;
  page: number;
  perPage: number;
  initialQ: string;
  title: string;
  showOnlyVerified: boolean;
  toggleShowVerified: Function;
}

const ViewSources: React.FC<Props> = ({
  sources,
  numFound,
  onPageChange,
  onSearch,
  page,
  perPage,
  initialQ,
  title,
  toggleShowVerified,
  showOnlyVerified
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
      <ContainerCards cards={sources} title={title} />
      <ContainerPagination
        num_found={Number(numFound)}
        per_page={Number(perPage)}
        page={page}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default ViewSources;
