import React from 'react';
import Header from '../../components/Header'
import { Grid } from '@material-ui/core'
import { ConceptsTable } from './components'

interface Props {

}

const ViewConceptsPage: React.FC<Props> = () => {
  return (
    <Header title="Concepts">
      <Grid id="viewConceptsPage" item xs={12} component="div">
        <ConceptsTable/>
      </Grid>
    </Header>
  );
};

export default ViewConceptsPage;

