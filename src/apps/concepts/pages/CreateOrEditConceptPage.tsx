import React, { useEffect } from "react";
import { Fab, Grid, Menu, MenuItem, Tooltip } from "@material-ui/core";
import { ConceptForm } from "../components";
import { AppState } from "../../../redux";
import {
  resetConceptFormAction,
  retrieveConceptAction,
  upsertAllMappingsErrorSelector,
  upsertConceptAndMappingsAction,
  upsertConceptAndMappingsLoadingSelector,
  upsertConceptAndMappingsProgressSelector,
  upsertConceptErrorsSelector,
  viewConceptErrorsSelector,
  viewConceptLoadingSelector
} from "../redux";
import { APIConcept, apiConceptToConcept, APIMapping, Concept } from "../types";
import { Redirect, useLocation, useParams } from "react-router";
import { connect } from "react-redux";
import Header from "../../../components/Header";
import { startCase, toLower } from "lodash";
import {
  debug,
  ProgressOverlay,
  useAnchor,
  usePrevious,
  useQueryParams,
  CONTEXT
} from "../../../utils";
import {
  DeleteSweepOutlined as DeleteIcon,
  MoreVert as MenuIcon,
  Pageview as PageViewIcon,
  RestoreFromTrashOutlined as RestoreIcon
} from "@material-ui/icons";
import { Link } from "react-router-dom";
import { APIDictionary } from "../../dictionaries";
import {
  dictionarySelector,
  makeRetrieveDictionaryAction,
  retrieveDictionaryLoadingSelector
} from "../../dictionaries/redux";

interface StateProps {
  fetchLoading: boolean;
  loading: boolean;
  concept?: APIConcept;
  linkedDictionary?: APIDictionary;
  mappings: APIMapping[];
  fetchErrors?: {};
  errors?: {};
  allMappingErrors?: { errors: string }[];
  progress?: string;
}

interface ActionProps {
  retrieveDictionary: (
    ...args: Parameters<ReturnType<typeof makeRetrieveDictionaryAction>>
  ) => void;
  retrieveConcept: (...args: Parameters<typeof retrieveConceptAction>) => void;
  upsertConcept: (
    ...args: Parameters<typeof upsertConceptAndMappingsAction>
  ) => void;
  resetConceptForm: () => void;
}

type Props = StateProps & ActionProps;

interface ConceptPageQueryParams {
  conceptClass: string;
  linkedDictionary: string;
}

const CreateOrEditConceptPage: React.FC<Props> = ({
  retrieveConcept,
  retrieveDictionary,
  concept,
  linkedDictionary,
  mappings,
  fetchLoading,
  fetchErrors,
  errors,
  loading,
  upsertConcept,
  resetConceptForm,
  allMappingErrors = [],
  progress
}) => {
  const { pathname: url } = useLocation();
  const { concept: conceptId } = useParams();
  const {
    conceptClass,
    linkedDictionary: linkedDictionaryUrl
  } = useQueryParams<ConceptPageQueryParams>();
  const previouslyLoading = usePrevious(loading);
  const [menuAnchor, handleMenuClick, handleMenuClose] = useAnchor();

  const sourceUrl = url.substring(0, url.indexOf("concepts/"));
  const conceptUrl = url.replace("/edit", "");
  const anyMappingsErrors =
    !!allMappingErrors.length && allMappingErrors.some(value => value);

  let context = conceptId ? CONTEXT.edit : CONTEXT.create;
  let originallyEditing = context === CONTEXT.edit;
  // we created a concept, but there were some errors with mappings, so we switch to edit mode
  if (!loading && previouslyLoading && concept && (errors || anyMappingsErrors))
    context = CONTEXT.edit;

  const defaultLocale = linkedDictionary?.default_locale;
  const supportedLocales = linkedDictionary?.supported_locales;

  const status =
    !errors && anyMappingsErrors
      ? "Some mappings were not updated or added. Fix the errors and retry."
      : progress;

  useEffect(() => {
    // only retrieve the concept if the context was edit at the beginning
    // otherwise we obviously have nothing to edit
    if (originallyEditing) retrieveConcept(conceptUrl);
    retrieveDictionary(linkedDictionaryUrl);

    // usually doing the following is a mistake and will bite us later
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => resetConceptForm(),
   // eslint-disable-next-line react-hooks/exhaustive-deps
   []);

  // everything went hunky-dory, and we should redirect the user to the view concept page
  if (!loading && previouslyLoading && concept && !errors && !anyMappingsErrors)
    return (
      <Redirect
        to={`${concept.version_url}${
          linkedDictionaryUrl ? `?linkedDictionary=${linkedDictionaryUrl}` : ""
        }`}
      />
    );

  return (
    <Header
      allowImplicitNavigation
      title={
        context === CONTEXT.edit
          ? "Edit " +
            ( concept ? concept.display_name : "concept" )
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
            onSubmit={(data: Concept) =>
              upsertConcept(data, sourceUrl, linkedDictionaryUrl)
            }
            defaultLocale={defaultLocale}
            supportedLocales={supportedLocales}
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
                  replace
                  className="link"
                  to={`${conceptUrl}?linkedDictionary=${linkedDictionaryUrl}`}
                >
                  Discard changes and view
                </Link>
              </MenuItem>
              <MenuItem
                disabled={loading}
                onClick={() => {
                  const rawConcept = apiConceptToConcept(concept, [], false);
                  if (rawConcept)
                    upsertConcept(
                      { ...rawConcept, retired: !concept?.retired },
                      sourceUrl,
                      linkedDictionaryUrl
                    );
                  else debug("Retiring failed: rawConcept is undefined");
                }}
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
  linkedDictionary: dictionarySelector(state),
  mappings: state.concepts.mappings,
  loading: upsertConceptAndMappingsLoadingSelector(state),
  fetchLoading:
    viewConceptLoadingSelector(state) ||
    retrieveDictionaryLoadingSelector(state),
  fetchErrors: viewConceptErrorsSelector(state),
  errors: upsertConceptErrorsSelector(state),
  allMappingErrors: upsertAllMappingsErrorSelector(state),
  progress: upsertConceptAndMappingsProgressSelector(state)
});

const mapActionsToProps = {
  resetConceptForm: resetConceptFormAction,
  retrieveDictionary: makeRetrieveDictionaryAction(true),
  retrieveConcept: retrieveConceptAction,
  upsertConcept: upsertConceptAndMappingsAction
};

export default connect<StateProps, ActionProps, unknown, AppState>(
  mapStateToProps,
  mapActionsToProps
)(CreateOrEditConceptPage);
