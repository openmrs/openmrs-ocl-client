/**
 * Fun fact: to date, this is the hardest part of this codebase to get right
 * And I'm not proud of everything here. A lot could improve, but the at the moment I don't know how
 */
import {
  createStyles,
  FormControl,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  TableCell,
  TableRow,
  Theme,
  Typography
} from "@material-ui/core";
import { ArrayHelpers, ErrorMessage, Field } from "formik";
import { AsyncSelect, NestedErrorMessage } from "../../../utils/components";
import { MAP_TYPES, Option, VERIFIED_SOURCES } from "../../../utils";
import { Select, TextField } from "formik-material-ui";
import React, { useEffect, useState } from "react";
import { Mapping } from "../types";
import api from "../api";
import { APISource } from "../../sources";
import { includes } from "lodash";
import {
  DeleteOutline as DeleteOutlineIcon,
  MoreVert as MoreVertIcon
} from "@material-ui/icons";
import clsx from "clsx";
import * as Yup from "yup";
import { VerifiedSource } from "../../../components/VerifiedSource";

interface ConceptOption extends Option {
  displayName: string;
}

export const MappingSchema = Yup.object()
  .shape<Mapping>({
    external_id: Yup.string(),
    from_concept_url: Yup.string(),
    map_type: Yup.string().required("Required"),
    to_source_url: Yup.string().required("Required"),
    to_concept_code: Yup.string().notRequired(),
    to_concept_url: Yup.string()
      .notRequired()
      .nullable(),
    to_concept_name: Yup.string()
      .notRequired()
      .nullable()
  })
  .test(
    "User should select a to concept",
    "A to concept is required",
    (value: Mapping) => !!value.to_concept_code || !!value.to_concept_url
  );
const buildEvent = (name: string, value?: any) => ({ target: { name, value } });

const option = (value?: string, label?: string) => ({ value, label });

const buildConceptLabel = (
  toConceptName?: string | null,
  toConceptUrl?: string | null
) =>
  toConceptName && toConceptUrl
    ? `${conceptCodeFromUrl(toConceptUrl)}- ${toConceptName}`
    : "";

export const isExternalSource = ({ source_type: sourceType }: APISource) =>
  includes(["External", "externalDictionary"], sourceType);

const conceptCodeFromUrl = (url: string): string => {
  let letters = url.split("");
  letters.reverse();
  letters.splice(0, 1);
  letters.splice(letters.indexOf("/"));
  letters.reverse();

  return letters.join("");
};

interface SourceOption extends Option {
  isInternalSource: boolean;
}

interface SourceResults {
  options: SourceOption[];
  hasMore: boolean;
  additional: {
    page: number;
  };
}

const fetchSourceOptions = async (
  query: string,
  _: {},
  { page }: { page: number }
): Promise<SourceResults> => {
  try {
    const response = await api.retrievePublicSources(page, 10, query);
    const {
      data,
      headers: { next = "None" }
    } = response;

    const actualSources: APISource[] = data.filter((source: APISource) => {
      return source.owner !== "OCL";
    });

    return {
      options: actualSources.map((source: APISource) => {
        const { name, url } = source;
        const icon = () => {
          return VERIFIED_SOURCES.includes(name) ? <VerifiedSource /> : "";
        };
        return {
          label: [name, icon()],
          value: url,
          isInternalSource: !isExternalSource(source)
        };
      }),
      hasMore: next !== "None",
      additional: {
        page: page + 1
      }
    };
  } catch (e) {
    return {
      options: [],
      hasMore: false,
      additional: {
        page: 1
      }
    };
  }
};

interface ConceptResults {
  options: ConceptOption[];
  hasMore: boolean;
  additional: {
    page: number;
  };
}

const fetchConceptOptions = async (
  sourceUrl: string,
  query: string,
  page: number
): Promise<ConceptResults> => {
  try {
    const response = await api.concepts.retrieve({
      conceptsUrl: `${sourceUrl}concepts/`,
      page: page,
      q: query
    });
    const {
      data,
      headers: { next = "None" }
    } = response;

    return {
      options: data.map(
        ({ display_name, url }: { display_name: string; url: string }) => ({
          label: buildConceptLabel(display_name, url),
          value: url,
          displayName: display_name
        })
      ),
      hasMore: next !== "None",
      additional: {
        page: page + 1
      }
    };
  } catch (e) {
    return {
      options: [],
      hasMore: false,
      additional: {
        page: 1
      }
    };
  }
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    row: {
      verticalAlign: "top"
    },
    retired: {
      opacity: 0.5
    },
    minCellWidth: {
      minWidth: "150px"
    },
    singleCellWidth: {
      width: "24%"
    },
    doubleCellWidth: {
      width: "48%"
    },
    tripleCellWidth: {
      width: "72%"
    },
    fillParent: {
      width: "100%"
    },
    menuItem: {
      width: "4%"
    },
    errorContainer: {
      textAlign: "center"
    }
  })
);

interface Props {
  value: Mapping;
  index: number;
  valuesKey: string;
  handleChange: Function;
  toggleMenu: Function;
  menu: { index: number; anchor: null | HTMLElement };
  arrayHelpers: ArrayHelpers;
  fixedMappingType?: Option;
  errors?: any;
  editing: boolean;
}

const MappingsTableRow: React.FC<Props> = ({
  value,
  index,
  valuesKey,
  handleChange,
  toggleMenu,
  menu,
  arrayHelpers,
  fixedMappingType,
  errors,
  editing
}) => {
  const classes = useStyles();

  const {
    to_source_url: toSourceUrl,
    to_concept_url: toConceptUrl,
    to_concept_name,
    to_concept_name_resolved,
    url,
    retired
  } = value;
  const [toConceptName, setToConceptName] = useState(to_concept_name);

  useEffect(() => {
    setToConceptName(to_concept_name ?? to_concept_name_resolved);
  }, [to_concept_name, to_concept_name_resolved]);

  const valueKey = `${valuesKey}[${index}]`;
  const conceptLabel = buildConceptLabel(toConceptName, toConceptUrl);

  const [isInternalMapping, setIsInternalMapping] = useState(
    toConceptUrl !== null
  );

  const resetToConcept = () => {
    // I don't like doing this imperatively, but I failed to use the useEffect hook for this
    handleChange(buildEvent(`${valueKey}.to_concept_url`, undefined));
    handleChange(buildEvent(`${valueKey}.to_concept_code`, undefined));
    handleChange(buildEvent(`${valueKey}.to_concept_name`, undefined));
  };

  // update default map_type
  useEffect(() => {
    if (!fixedMappingType)
      handleChange(buildEvent(`${valueKey}.map_type`, value.map_type));
    // usually doing the following is a mistake and will bite us later
    // we do it here because updating the default map_type should only ever be triggered when this changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInternalMapping]);

  // update map_type from fixed map_type
  useEffect(() => {
    if (fixedMappingType)
      handleChange(buildEvent(`${valueKey}.map_type`, fixedMappingType.value));
    // usually doing the following is a mistake and will bite us later
    // we do it here because setting the fixed map_type should only ever be triggered once. We only include fixedMappingType for sanity
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fixedMappingType]);

  return (
    <>
      <TableRow
        data-testrowid={`${valuesKey}_${index}`}
        className={clsx(classes.row, { [classes.retired]: retired })}
      >
        <TableCell
          className={classes.singleCellWidth}
          component="td"
          scope="row"
        >
          <FormControl
            fullWidth
            margin="dense"
            className={classes.minCellWidth}
          >
            <Field
              id={`${valueKey}.to_source_url`}
              name={`${valueKey}.to_source_url`}
              component={AsyncSelect}
              onChange={(option: SourceOption | null) => {
                resetToConcept();
                if (option) {
                  handleChange(
                    buildEvent(`${valueKey}.to_source_url`, option.value)
                  );
                  setIsInternalMapping(option.isInternalSource);
                } else {
                  handleChange(
                    buildEvent(`${valueKey}.to_source_url`, undefined)
                  );
                  setIsInternalMapping(true);
                }
              }}
              value={
                toSourceUrl
                  ? option(toSourceUrl, conceptCodeFromUrl(toSourceUrl))
                  : undefined
              }
              placeholder="Select a source"
              loadOptions={fetchSourceOptions}
              additional={{ page: 1 }}
              isDisabled={!editing}
            />
            <Typography color="error" variant="caption" component="div">
              <NestedErrorMessage name={`${valueKey}.to_source_url`} />
            </Typography>
          </FormControl>
        </TableCell>

        {fixedMappingType ? null : (
          <TableCell
            className={classes.singleCellWidth}
            component="td"
            scope="row"
          >
            <FormControl fullWidth margin="dense">
              <Field
                style={{ marginTop: "10px" }}
                id={`${valueKey}.map_type`}
                name={`${valueKey}.map_type`}
                data-testid={`${valuesKey}_${index}_map_type`}
                component={Select}
              >
                {MAP_TYPES.map(mapType => (
                  <MenuItem key={mapType.value} value={mapType.value}>
                    {mapType.label}
                  </MenuItem>
                ))}
              </Field>
              <Typography color="error" variant="caption" component="div">
                <NestedErrorMessage name={`${valueKey}.map_type`} />
              </Typography>
            </FormControl>
          </TableCell>
        )}

        {isInternalMapping ? (
          <TableCell
            className={
              fixedMappingType
                ? classes.tripleCellWidth
                : classes.doubleCellWidth
            }
            component="td"
            scope="row"
          >
            <FormControl
              fullWidth
              margin="dense"
              className={classes.minCellWidth}
            >
              <Field
                key={`${toSourceUrl}_to_concept_url`}
                id={`${valueKey}.to_concept_url`}
                name={`${valueKey}.to_concept_url`}
                component={AsyncSelect}
                onChange={(option: ConceptOption | null) => {
                  if (option) {
                    handleChange(
                      buildEvent(`${valueKey}.to_concept_url`, option.value)
                    );
                    handleChange(
                      buildEvent(
                        `${valueKey}.to_concept_name`,
                        option.displayName
                      )
                    );
                  } else {
                    handleChange(
                      buildEvent(`${valueKey}.to_concept_url`, undefined)
                    );
                    handleChange(
                      buildEvent(`${valueKey}.to_concept_name`, undefined)
                    );
                  }
                }}
                value={
                  toConceptUrl ? option(toConceptUrl, conceptLabel) : undefined
                }
                placeholder="Select a concept"
                isDisabled={!editing || !toSourceUrl}
                loadOptions={async (
                  query: string,
                  _: {},
                  { page }: { page: number }
                ) => {
                  if (!toSourceUrl)
                    return {
                      options: [],
                      hasMore: false,
                      additional: {
                        page: 1
                      }
                    };
                  return fetchConceptOptions(toSourceUrl, query, page);
                }}
                additional={{ page: 1 }}
                cacheUniq={toSourceUrl}
              />
            </FormControl>
          </TableCell>
        ) : (
          <TableCell
            className={classes.doubleCellWidth}
            component="td"
            scope="row"
          >
            <Field
              key={`${toSourceUrl}_to_concept_code`}
              fullWidth
              id={`${valueKey}.to_concept_code`}
              name={`${valueKey}.to_concept_code`}
              placeholder="To concept code"
              margin="dense"
              component={TextField}
            />
            <br />
            <Field
              key={`${toSourceUrl}_to_concept_name`}
              fullWidth
              id={`${valueKey}.to_concept_name`}
              name={`${valueKey}.to_concept_name`}
              placeholder="To concept name"
              margin="dense"
              component={TextField}
            />
          </TableCell>
        )}
        <TableCell className={classes.menuItem} component="td" scope="row">
          {!editing ? (
            ""
          ) : (
            <IconButton
              id={`${valueKey}.menu-icon`}
              aria-controls={`${valueKey}.menu`}
              aria-haspopup="true"
              onClick={event => toggleMenu(index, event)}
            >
              <MoreVertIcon />
            </IconButton>
          )}
          <Menu
            anchorEl={menu.anchor}
            id={`${valuesKey}[${index}].menu`}
            open={index === menu.index}
            onClose={() => toggleMenu(index)}
          >
            {url ? (
              <MenuItem
                onClick={() => {
                  handleChange(buildEvent(`${valueKey}.retired`, !retired));
                  toggleMenu(index);
                }}
              >
                <DeleteOutlineIcon />
                {retired ? "UnRetire" : "Retire"}
              </MenuItem>
            ) : (
              <MenuItem
                onClick={() => {
                  arrayHelpers.remove(index);
                  toggleMenu(index);
                }}
              >
                <DeleteOutlineIcon /> Delete
              </MenuItem>
            )}
          </Menu>
        </TableCell>
      </TableRow>
      {typeof errors !== "string" ? null : (
        <Typography
          className={classes.errorContainer}
          color="error"
          variant="caption"
          component="tr"
        >
          <td />
          {fixedMappingType ? null : <td />}
          <ErrorMessage name={valueKey} component="td" />
        </Typography>
      )}
    </>
  );
};

export default MappingsTableRow;
