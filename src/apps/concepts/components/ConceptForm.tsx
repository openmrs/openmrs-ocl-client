import React, { useEffect, useRef, useState } from "react";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import { Concept, ConceptDescription, ConceptName, Mapping } from "../types";
import uuid from "uuid";
import {
  Button,
  createStyles,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  makeStyles,
  MenuItem,
  Paper,
  Theme,
  Typography
} from "@material-ui/core";
import { Select, TextField } from "formik-material-ui";
import {
  CONCEPT_CLASSES,
  DATA_TYPES,
  getPrettyError,
  MAP_TYPE_CONCEPT_SET,
  MAP_TYPE_Q_AND_A,
  NAME_TYPES,
  QUESTION_CONCEPT_CLASS,
  SET_CONCEPT_CLASSES
} from "../../../utils";
import NamesTable from "./NamesTable";
import { EditOutlined as EditIcon } from "@material-ui/icons";
import * as Yup from "yup";
import MappingsTable from "./MappingsTable";
import { CONTEXT } from "../constants";
import {
  ANSWERS_BATCH_INDEX,
  MAPPINGS_BATCH_INDEX,
  SETS_BATCH_INDEX
} from "../redux/constants";

const ANSWERS_VALUE_KEY = "answers";
const SETS_VALUE_KEY = "sets";
const MAPPINGS_VALUE_KEY = "mappings";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonContainer: {
      textAlign: "center"
    }
  })
);

const castNecessaryValues = (values: Concept) => {
  const { names } = values;
  return {
    ...values,
    names: names.map((name: ConceptName) => ({
      ...name,
      name_type: name.name_type === "null" ? null : name.name_type // api represents 'Synonym' name_type as null
    }))
  };
};

const createName = (nameType: string = NAME_TYPES[0].value): ConceptName => ({
  name: "",
  locale: "",
  external_id: uuid(),
  locale_preferred: false,
  name_type: nameType
});

const createDescription = (): ConceptDescription => ({
  description: "",
  locale: "",
  external_id: uuid(),
  locale_preferred: false
});

const createMapping = (map_type: string = ""): Mapping => ({
  external_id: uuid(),
  from_concept_url: "",
  to_source_url: "",
  map_type
});

const initialValues: Concept = {
  concept_class: "",
  datatype: DATA_TYPES[0],
  descriptions: [],
  external_id: uuid(),
  id: "",
  answers: [],
  sets: [],
  mappings: [],
  names: [createName()]
};

const buildInitialValues = (
  conceptClass: string = initialValues.concept_class
) => ({
  ...initialValues,
  concept_class: conceptClass
});

const MappingSchema = Yup.object()
  .shape<Mapping>({
    external_id: Yup.string(),
    from_concept_url: Yup.string(),
    map_type: Yup.string().required("Required"),
    to_source_url: Yup.string().required("Required"),
    to_concept_code: Yup.string().notRequired(),
    to_concept_url: Yup.string().notRequired(),
    to_concept_name: Yup.string().notRequired()
  })
  .test(
    "User should select a to concept",
    "A to concept is required",
    (value: Mapping) => !!value.to_concept_code || !!value.to_concept_url
  );

const ConceptSchema = Yup.object().shape<Concept>({
  concept_class: Yup.string().required("Required"),
  datatype: Yup.string().required("Required"),
  names: Yup.array()
    .of(
      Yup.object().shape<ConceptName>({
        name: Yup.string().required("Required"),
        name_type: Yup.string().required("Required"),
        external_id: Yup.string().required(),
        locale: Yup.string().required("Required"),
        locale_preferred: Yup.boolean().required("Required")
      })
    )
    .min(1, "Concept must have at least one name"),
  descriptions: Yup.array()
    .of(
      Yup.object().shape<ConceptDescription>({
        description: Yup.string().required("Required"),
        external_id: Yup.string().required(),
        locale: Yup.string().required("Required"),
        locale_preferred: Yup.boolean().required("Required")
      })
    )
    .min(0),
  external_id: Yup.string().required(),
  id: Yup.string().required("Required"),
  [ANSWERS_VALUE_KEY]: Yup.array()
    .of(MappingSchema)
    .min(0),
  [SETS_VALUE_KEY]: Yup.array()
    .of(MappingSchema)
    .min(0),
  [MAPPINGS_VALUE_KEY]: Yup.array()
    .of(MappingSchema)
    .min(0)
});

interface Props {
  loading?: boolean;
  onSubmit?: Function;
  errors?: {};
  context?: string;
  savedValues?: Concept;
  allMappingErrors?: { errors: string }[];
  status?: string;
  conceptClass?: string;
  supportLegacyMappings?: boolean;
}

const ConceptForm: React.FC<Props> = ({
  loading = false,
  onSubmit,
  status,
  errors,
  allMappingErrors = [],
  context = "view",
  savedValues,
  conceptClass,
  supportLegacyMappings = true
}) => {
  const allowEditing = context === CONTEXT.edit || context === CONTEXT.create;
  const allowIdEdits = context === CONTEXT.create;
  const showAnswers =
    (context === CONTEXT.edit && supportLegacyMappings) ||
    (context === CONTEXT.create &&
      (!conceptClass || conceptClass === QUESTION_CONCEPT_CLASS)) ||
    (context === CONTEXT.view && supportLegacyMappings);
  const showSets =
    (context === CONTEXT.edit && supportLegacyMappings) ||
    (context === CONTEXT.create &&
      (!conceptClass || SET_CONCEPT_CLASSES.includes(conceptClass))) ||
    (context === CONTEXT.view && supportLegacyMappings);

  const classes = useStyles();

  const error: string | undefined = getPrettyError(errors);

  const formikRef: any = useRef(null);

  const [isExternalIDEditable, setExternalIDEditable] = useState(false);
  const toggleExternalIDEditable = () =>
    setExternalIDEditable(!isExternalIDEditable);

  useEffect(() => {
    const { current: currentRef } = formikRef;
    if (currentRef) {
      currentRef.setSubmitting(loading || !allowEditing);
    }
  }, [loading, allowEditing]);

  useEffect(() => {
    const { current: currentRef } = formikRef;
    if (currentRef) {
      currentRef.setStatus(status);
    }
  }, [status]);

  useEffect(() => {
    const { current: currentRef } = formikRef;
    if (!currentRef || !savedValues) return;

    currentRef.setFieldValue("url", savedValues.url, false);
  }, [savedValues]);

  useEffect(() => {
    // fun one, ain't it? any who, we need to manually add a url to each mapping
    // This is the only indicator that a concept has been created and is being edited going forward
    const { current: currentRef } = formikRef;
    if (!currentRef || !savedValues) return;

    [ANSWERS_VALUE_KEY, SETS_VALUE_KEY, MAPPINGS_VALUE_KEY].forEach(key => {
      // @ts-ignore
      savedValues[key].forEach((value: Mapping, index: number) =>
        currentRef.setFieldValue(`${key}[${index}].url`, value.url, false)
      );
    });
  }, [savedValues]);

  useEffect(() => {
    const { current: currentRef } = formikRef;
    if (!currentRef) return;

    Object.keys(initialValues).forEach(key => {
      const error = getPrettyError(errors, key);
      if (error) currentRef.setFieldError(key, error);
    });
  }, [errors]);

  useEffect(() => {
    // another fun one, we need to manually copy mapping errors from redux into formik
    const { current: currentRef } = formikRef;
    if (!currentRef) return;

    [
      [ANSWERS_VALUE_KEY, ANSWERS_BATCH_INDEX],
      [SETS_VALUE_KEY, SETS_BATCH_INDEX],
      [MAPPINGS_VALUE_KEY, MAPPINGS_BATCH_INDEX]
    ].forEach(([key, batchIndex]) => {
      currentRef.state.values[key].forEach((_: Mapping, index: number) => {
        const error = allMappingErrors[Number(`${batchIndex}${index}`)];
        console.log(error, `${key}[${index}]`);
        if (error) currentRef.setFieldError(`${key}[${index}]`, error.errors);
      });
    });
    // i don't know hoe the comparison algorithm works, but for this array, it fails.
    // stringify the array to work around that
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allMappingErrors.toString()]);

  return (
    <Formik
      ref={formikRef}
      initialValues={savedValues || buildInitialValues(conceptClass)}
      validationSchema={ConceptSchema}
      onSubmit={values => {
        if (onSubmit) onSubmit(castNecessaryValues(values));
      }}
    >
      {({ isSubmitting, status, values, errors, handleChange }) => (
        <Form id="conceptForm">
          <Paper className="fieldsetParent">
            <fieldset>
              <Typography component="legend" variant="h5" gutterBottom>
                Concept Details
              </Typography>
              <Field
                fullWidth
                id="external_id"
                name="external_id"
                label="OpenMRS UUID (OCL External ID)"
                margin="normal"
                disabled={!isExternalIDEditable}
                component={TextField}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        disabled={!(allowEditing && allowIdEdits)}
                        aria-label="toggle external id editable"
                        onClick={toggleExternalIDEditable}
                      >
                        <EditIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <Field
                fullWidth
                id="id"
                name="id"
                label="OCL ID"
                margin="normal"
                component={TextField}
                disabled={!(allowEditing && allowIdEdits)}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="concept_class">Class</InputLabel>
                <Field
                  name="concept_class"
                  id="concept_class"
                  component={Select}
                  disabled={conceptClass}
                >
                  {CONCEPT_CLASSES.map(conceptClass => (
                    <MenuItem key={conceptClass} value={conceptClass}>
                      {conceptClass}
                    </MenuItem>
                  ))}
                </Field>
                <Typography color="error" variant="caption" component="div">
                  <ErrorMessage name="concept_class" component="span" />
                </Typography>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="class">Datatype</InputLabel>
                <Field name="datatype" id="datatype" component={Select}>
                  {DATA_TYPES.map(datatype => (
                    <MenuItem key={datatype} value={datatype}>
                      {datatype}
                    </MenuItem>
                  ))}
                </Field>
                <Typography color="error" variant="caption" component="div">
                  <ErrorMessage name="datatype" component="span" />
                </Typography>
              </FormControl>
            </fieldset>
          </Paper>
          <br />
          <Paper className="fieldsetParent">
            <fieldset>
              <Typography component="legend" variant="h5" gutterBottom>
                Names
              </Typography>
              <FieldArray name="names">
                {arrayHelpers => (
                  <NamesTable
                    useTypes
                    createNewValue={() => createName(NAME_TYPES[1].value)}
                    type="name"
                    title="Name"
                    valuesKey="names"
                    values={values.names}
                    errors={errors.names}
                    arrayHelpers={arrayHelpers}
                    isSubmitting={isSubmitting}
                    editing={allowEditing}
                  />
                )}
              </FieldArray>
            </fieldset>
          </Paper>
          <br />
          <Paper className="fieldsetParent">
            <fieldset>
              <Typography component="legend" variant="h5" gutterBottom>
                Descriptions
              </Typography>
              <FieldArray name="descriptions">
                {arrayHelpers => (
                  <NamesTable
                    multiline
                    createNewValue={createDescription}
                    type="description"
                    title="Description"
                    valuesKey="descriptions"
                    values={values.descriptions}
                    errors={errors.descriptions}
                    arrayHelpers={arrayHelpers}
                    isSubmitting={isSubmitting}
                    editing={allowEditing}
                  />
                )}
              </FieldArray>
            </fieldset>
          </Paper>
          <br />
          {!showAnswers ? null : (
            <>
              <Paper className="fieldsetParent">
                <fieldset>
                  <Typography component="legend" variant="h5" gutterBottom>
                    Answers
                  </Typography>
                  <FieldArray name={ANSWERS_VALUE_KEY}>
                    {arrayHelpers => (
                      <MappingsTable
                        createNewMapping={() =>
                          createMapping(MAP_TYPE_Q_AND_A.value)
                        }
                        valuesKey={ANSWERS_VALUE_KEY}
                        values={values.answers}
                        errors={errors.answers}
                        arrayHelpers={arrayHelpers}
                        isSubmitting={isSubmitting}
                        handleChange={handleChange}
                        title="answer"
                        fixedMappingType={MAP_TYPE_Q_AND_A}
                        editing={allowEditing}
                      />
                    )}
                  </FieldArray>
                </fieldset>
              </Paper>
              <br />
            </>
          )}
          {!showSets ? null : (
            <>
              <Paper className="fieldsetParent">
                <fieldset>
                  <Typography component="legend" variant="h5" gutterBottom>
                    Sets
                  </Typography>
                  <FieldArray name={SETS_VALUE_KEY}>
                    {arrayHelpers => (
                      <MappingsTable
                        createNewMapping={() =>
                          createMapping(MAP_TYPE_CONCEPT_SET.value)
                        }
                        valuesKey={SETS_VALUE_KEY}
                        values={values.sets}
                        errors={errors.sets}
                        arrayHelpers={arrayHelpers}
                        isSubmitting={isSubmitting}
                        handleChange={handleChange}
                        title="set"
                        fixedMappingType={MAP_TYPE_CONCEPT_SET}
                        editing={allowEditing}
                      />
                    )}
                  </FieldArray>
                </fieldset>
              </Paper>
              <br />
            </>
          )}
          <Paper className="fieldsetParent">
            <fieldset>
              <Typography component="legend" variant="h5" gutterBottom>
                Mappings
              </Typography>
              <FieldArray name={MAPPINGS_VALUE_KEY}>
                {arrayHelpers => (
                  <MappingsTable
                    createNewMapping={createMapping}
                    valuesKey={MAPPINGS_VALUE_KEY}
                    values={values.mappings}
                    errors={errors.mappings}
                    arrayHelpers={arrayHelpers}
                    isSubmitting={isSubmitting}
                    handleChange={handleChange}
                    title="mapping"
                    editing={allowEditing}
                  />
                )}
              </FieldArray>
            </fieldset>
          </Paper>
          <br />
          {!allowEditing ? (
            ""
          ) : (
            <div className={classes.buttonContainer}>
              {!status ? (
                <br />
              ) : (
                <Typography
                  color="textSecondary"
                  variant="caption"
                  component="div"
                >
                  {status}
                </Typography>
              )}
              {!error ? (
                <br />
              ) : (
                <Typography color="error" variant="caption" component="div">
                  {error}
                </Typography>
              )}
              <Button
                variant="outlined"
                color="primary"
                size="large"
                type="submit"
                disabled={isSubmitting}
              >
                Submit
              </Button>
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default ConceptForm;
