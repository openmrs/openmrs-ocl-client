import React, { useEffect } from 'react'
import { Fab, Grid, Menu, MenuItem, Tooltip } from '@material-ui/core'
import { ConceptForm } from '../components'
import { AppState } from '../../../redux'
import {
  retrieveConceptAction,
  upsertAllMappingsErrorSelector,
  upsertConceptAndMappingsAction,
  upsertConceptAndMappingsLoadingSelector,
  upsertConceptAndMappingsProgressSelector,
  upsertConceptErrorsSelector,
  viewConceptErrorsSelector,
  viewConceptLoadingSelector
} from '../redux'
import { APIConcept, apiConceptToConcept, APIMapping, BaseConcept } from '../types'
import { Redirect, useLocation, useParams } from 'react-router'
import { connect } from 'react-redux'
import Header from '../../../components/Header'
import { startCase, toLower } from 'lodash'
import { ProgressOverlay, useAnchor, usePrevious, useQuery } from '../../../utils'
import { CONTEXT } from '../constants'
import {
  DeleteSweepOutlined as DeleteIcon,
  MoreVert as MenuIcon,
  Pageview as PageViewIcon,
  RestoreFromTrashOutlined as RestoreIcon
} from '@material-ui/icons'
import { Link } from 'react-router-dom'

interface Props {
  fetchLoading: boolean;
  loading: boolean;
  concept?: APIConcept;
  mappings: APIMapping[];
  fetchErrors?: {};
  errors?: {};
  retrieveConcept: Function;
  upsertConcept: Function;
  allMappingErrors?: { errors: string }[];
  progress?: string;
}

const CreateOrEditConceptPage: React.FC<Props> = ({
  retrieveConcept,
  concept,
  mappings,
  fetchLoading,
  fetchErrors,
  errors,
  loading,
  upsertConcept,
  allMappingErrors = [],
  progress
}) => {
  const { pathname: url } = useLocation();
  const { concept: conceptId } = useParams();
  const { conceptClass, linkedDictionary } = useQuery();
  const previouslyLoading = usePrevious(loading);
  const [menuAnchor, handleMenuClick, handleMenuClose] = useAnchor();

  const sourceUrl = url.substring(0, url.indexOf("concepts/"));
  const conceptUrl = concept?.version_url || url.replace("/edit", "");
  const anyMappingsErrors =
    !!allMappingErrors.length && allMappingErrors.some(value => value);

  let context = conceptId ? CONTEXT.edit : CONTEXT.create;
  let originallyEditing = context === CONTEXT.edit;
  // we created a concept, but there were some errors with mappings, so we switch to edit mode
  if (!loading && previouslyLoading && concept && (errors || anyMappingsErrors))
    context = CONTEXT.edit;

  const status =
    !errors && anyMappingsErrors
      ? "Concept updated. Some mappings were not updated or added. Fix the errors and retry."
      : progress;

  useEffect(() => {
    // only retrieve the concept if the context was edit at the beginning
    // otherwise we obviously have nothing to edit
    if (originallyEditing) retrieveConcept(conceptUrl);
    // usually doing the following is a mistake and will bite us later
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // everything went hunky-dory, and we should redirect the user to the view concept page
  if (!loading && previouslyLoading && concept && !errors && !anyMappingsErrors)
    return (
      <Redirect
        to={`${concept.version_url}${
          linkedDictionary ? `?linkedDictionary=${linkedDictionary}` : ""
        }&linkedSource=${sourceUrl}`}
      />
    );

  return (
    <Header
      title={
        context === CONTEXT.edit
          ? "Edit " +
            startCase(toLower(concept ? concept.display_name : "concept"))
          : "Create concept"
      }
    >
      <ProgressOverlay delayRender loading={fetchLoading}>
        <Grid id="editConceptPage" item xs={8} component="div">
          <ConceptForm
            conceptClass={conceptClass}
            context={context}
            status={status}
            savedValues={
              context === CONTEXT.edit
                ? apiConceptToConcept(concept, mappings)
                : undefined
            }
            loading={loading}
            errors={errors}
            allMappingErrors={allMappingErrors}
            supportLegacyMappings={originallyEditing}
            onSubmit={(data: BaseConcept) =>
              upsertConcept(data, sourceUrl, linkedDictionary)
            }
          />
        </Grid>

        {context !== CONTEXT.edit ? null : (
          <>
            <Tooltip title="Menu">
              <Fab onClick={handleMenuClick} color="primary" className="fab">
                <MenuIcon />
              </Fab>
            </Tooltip>
            <Menu
              anchorEl={menuAnchor}
              keepMounted
              open={Boolean(menuAnchor)}
              onClose={handleMenuClose}
            >
              <MenuItem>
                <PageViewIcon />
                <Link
                  className="link"
                  to={`${conceptUrl}?linkedDictionary=${linkedDictionary}&linkedSource=${sourceUrl}`}
                >
                  Discard changes and view
                </Link>
              </MenuItem>
              <MenuItem
                disabled={loading}
                onClick={() =>
                  upsertConcept(
                    {
                      ...apiConceptToConcept(concept),
                      retired: !concept?.retired
                    },
                    sourceUrl,
                    linkedDictionary
                  )
                }
              >
                {concept?.retired ? (
                  <>
                    <RestoreIcon />
                    Unretire concept
                  </>
                ) : (
                  <>
                    <DeleteIcon />
                    Retire concept
                  </>
                )}
              </MenuItem>
            </Menu>
          </>
        )}
      </ProgressOverlay>
    </Header>
  );
};

const mapStateToProps = (state: AppState) => ({
  concept: state.concepts.concept,
  mappings: state.concepts.mappings,
  loading: upsertConceptAndMappingsLoadingSelector(state),
  fetchLoading: viewConceptLoadingSelector(state),
  fetchErrors: viewConceptErrorsSelector(state),
  errors: upsertConceptErrorsSelector(state),
  allMappingErrors: upsertAllMappingsErrorSelector(state),
  progress: upsertConceptAndMappingsProgressSelector(state)
});

const mapActionsToProps = {
  retrieveConcept: retrieveConceptAction,
  upsertConcept: upsertConceptAndMappingsAction
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(CreateOrEditConceptPage);
