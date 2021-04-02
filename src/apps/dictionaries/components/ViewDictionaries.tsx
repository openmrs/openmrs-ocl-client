import React from "react";
import { APIDictionary } from "../types";
import {
  ContainerCards,
  ContainerPagination,
  ContainerSearch
} from "../../containers/components";

interface Props {
  dictionaries: APIDictionary[];
  numFound: number;
  onPageChange: Function;
  onSearch: Function;
  page: number;
  perPage: number;
  initialQ: string;
  title: string;
}

const ViewDictionaries: React.FC<Props> = ({
  dictionaries,
  numFound,
  onPageChange,
  onSearch,
  page,
  perPage,
  initialQ,
  title
}) => {
  return (
    <>
      <ContainerSearch title={title} onSearch={onSearch} initialQ={initialQ} />
      <ContainerCards cards={dictionaries} title={title} />
      <ContainerPagination
        num_found={Number(numFound)}
        per_page={Number(perPage)}
        page={page}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default ViewDictionaries;
