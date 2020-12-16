import React from 'react';
import { APIOrganisation } from "../types";
import {
  ContainerSearch,
} from "../../containers/components";
import  OrganisationCards  from './organisationCards';

interface Props {
  organisations: APIOrganisation[];
  title: string;
  onSearch: Function;
  initialQ: string;
}

const ViewOrganisations: React.FC<Props> = ({
  organisations,
  title,
  onSearch,
  initialQ
}) => {
  

  return (
    <>
      <ContainerSearch title={title} onSearch={onSearch} initialQ={initialQ} />
      <OrganisationCards cards={organisations} title="Organisations" />
    </>
  );
};

export default ViewOrganisations;