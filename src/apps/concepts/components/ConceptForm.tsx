import React, { useState } from 'react'
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik'
import { Concept, ConceptDescription, ConceptName } from '../types'
import uuid from 'uuid';
import {
    Button,
    createStyles,
    FormControl, IconButton, InputAdornment,
    InputLabel,
    makeStyles,
    MenuItem,
    Paper,
    Theme,
    Typography
} from '@material-ui/core'
import { Select, TextField } from 'formik-material-ui'
import { CONCEPT_CLASSES, DATA_TYPES, NAME_TYPES } from '../../../utils'
import NameTable from './NameTable'
import {Edit as EditIcon} from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
      buttonContainer: {
        textAlign: 'center',
      },
  }),
);

const castNecessaryValues = (values: Concept) => {
  values.names.map((name: ConceptName) => {
      const {name_type} = name;
      return {
          ...name,
          name_type: name_type === 'null' ? null : name_type, // api represents 'Synonym' name_type as null
      };
  });
};

const createName = (nameType: string=NAME_TYPES[0].value): ConceptName => ({
    name: "",
    locale: "",
    external_id: uuid(),
    locale_preferred: false,
    name_type: nameType,
});

const createDescription = (): ConceptDescription => ({
    description: "",
    locale: "",
    external_id: uuid(),
    locale_preferred: false,
});

const initialValues: Concept = {
    concept_class: "",
    datatype: DATA_TYPES[0],
    descriptions: [createDescription()],
    external_id: uuid(),
    id: "",
    mappings: [],
    names: [createName()],
};

const ConceptForm: React.FC = () => {
    const classes = useStyles();

    const [isExternalIDEditable, setExternalIDEditable] = useState(false);
    const toggleExternalIDEditable = () => setExternalIDEditable(!isExternalIDEditable);

    return (
        <Formik
          initialValues={initialValues}
          onSubmit={values => {console.log(castNecessaryValues(values))}}
        >
            {({isSubmitting, status, values}) => (
                <Form>
                    <Paper className="fieldsetParent">
                        <fieldset>
                            <Typography component="legend" variant="h5" gutterBottom>Concept Details</Typography>
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
                                          aria-label="toggle external id editable"
                                          onClick={toggleExternalIDEditable}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </InputAdornment>
                                  ),
                              }}
                            />
                            <Field
                              fullWidth
                              id="id"
                              name="id"
                              label="OCL ID"
                              margin="normal"
                              component={TextField}
                            />
                            <FormControl
                              fullWidth
                              margin="normal"
                            >
                                <InputLabel htmlFor="concept_class">Class</InputLabel>
                                <Field
                                  name="concept_class"
                                  id="concept_class"
                                  component={Select}
                                >
                                    {CONCEPT_CLASSES.map(conceptClass => <MenuItem key={conceptClass} value={conceptClass}>{conceptClass}</MenuItem>)}
                                </Field>
                                <Typography color="error" variant="caption" component="div">
                                    <ErrorMessage name="class" component="span"/>
                                </Typography>
                            </FormControl>
                            <FormControl
                              fullWidth
                              margin="normal"
                            >
                                <InputLabel htmlFor="class">Datatype</InputLabel>
                                <Field
                                  name="datatype"
                                  id="datatype"
                                  component={Select}
                                >
                                    {DATA_TYPES.map(datatype => <MenuItem key={datatype} value={datatype}>{datatype}</MenuItem>)}
                                </Field>
                                <Typography color="error" variant="caption" component="div">
                                    <ErrorMessage name="datatype" component="span"/>
                                </Typography>
                            </FormControl>
                        </fieldset>
                    </Paper>
                    <br/>
                    <Paper className="fieldsetParent">
                        <fieldset>
                            <Typography component="legend" variant="h5" gutterBottom>Names</Typography>
                            <FieldArray name="names">
                                {arrayHelpers => (
                                  <NameTable
                                    useTypes
                                    createNewValue={() => createName(NAME_TYPES[1].value)}
                                    type="name"
                                    title="Name"
                                    valuesKey="names"
                                    values={values.names}
                                    arrayHelpers={arrayHelpers}
                                    isSubmitting={isSubmitting}
                                  />
                                )}
                            </FieldArray>
                        </fieldset>
                    </Paper>
                    <br/>
                    <Paper className="fieldsetParent">
                        <fieldset>
                            <Typography component="legend" variant="h5" gutterBottom>Descriptions</Typography>
                            <FieldArray name="descriptions">
                                {arrayHelpers => (
                                  <NameTable
                                    multiline
                                    createNewValue={createDescription}
                                    type="description"
                                    title="Description"
                                    valuesKey="descriptions"
                                    values={values.descriptions}
                                    arrayHelpers={arrayHelpers}
                                    isSubmitting={isSubmitting}
                                  />
                                )}
                            </FieldArray>
                        </fieldset>
                    </Paper>
                    <br/>
                    <div className={classes.buttonContainer}>
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
                </Form>
            )}
        </Formik>
    );
};

export default ConceptForm;
