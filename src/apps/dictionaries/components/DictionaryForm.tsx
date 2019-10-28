import React, {useEffect, useRef} from 'react';
import {Button, FormControl, InputLabel, MenuItem, Paper, Typography} from "@material-ui/core";
import './DictionaryForm.scss';
import {getPrettyError, locales} from "../../../utils";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {TextField, Select} from "formik-material-ui";
import {snakeCase} from 'lodash';

import {Dictionary} from "../types";
import {APIOrg, APIProfile} from "../../authentication";

interface Props {
    onSubmit: Function,
    loading: boolean,
    status?: string,
    profile?: APIProfile,
    usersOrgs: APIOrg[],
    errors?: {},
}

const DictionarySchema = Yup.object().shape({
    dictionaryName: Yup.string()
        .required('Dictionary name is required'),
    shortCode: Yup.string()
        .required('Short code is required'),
    description: Yup.string()
        .notRequired(),
    preferredSource: Yup.string()
        .required('Select a preferred source')
        .oneOf(['CIEL'], 'This source is not supported'),
    ownerUrl: Yup.string()
        .required('Select this dictionary\'s owner'),
    visibility: Yup.string()
        .required('Select who will have access to this dictionary'),
    preferredLanguage: Yup.string()
        .required('Select a preferred language'),
    otherLanguages: Yup.array(Yup.string()),
});

const initialValues = {
    dictionaryName: '',
    shortCode: '',
    description: '',
    preferredSource: 'CIEL',
    ownerUrl: '',
    visibility: '',
    preferredLanguage: '',
    otherLanguages: [],
};

const DictionaryForm: React.FC<Props> = ({onSubmit, loading, status, profile, usersOrgs, errors}) => {
    const formikRef: any = useRef(null);
    const error: string | undefined = getPrettyError(errors);

    useEffect(() => {
        const {current: currentRef} = formikRef;
        if (currentRef) {
            currentRef.setSubmitting(loading);
        }
    }, [loading]);

    useEffect(() => {
        const {current: currentRef} = formikRef;
        if (currentRef) {
            currentRef.setStatus(status);
        }
    }, [status]);

    useEffect(() => {
        const {current: currentRef} = formikRef;
        if (!currentRef) return;

        Object.keys(initialValues).forEach((key) => {
            const error = getPrettyError(errors, snakeCase(key === 'shortCode' ? 'id' : key));
            if (error) currentRef.setFieldError(key, error);
        });
    }, [errors]);

    return (
        <div id="dictionary-form">
            <Formik
                ref={formikRef}
                initialValues={initialValues}
                validationSchema={DictionarySchema}
                validateOnChange={false}
                onSubmit={(values: Dictionary) => onSubmit(values)}
            >
                {({isSubmitting, status}) => (
                    <Form>
                        <Field
                            required
                            fullWidth
                            id="dictionaryName"
                            name="dictionaryName"
                            label="Dictionary Name"
                            margin="normal"
                            component={TextField}
                        />
                        <Field
                            required
                            fullWidth
                            id="shortCode"
                            name="shortCode"
                            label="Short Code"
                            margin="normal"
                            component={TextField}
                        />
                        <Field
                            fullWidth
                            multiline
                            rowsMax={4}
                            id="description"
                            name="description"
                            label="Description"
                            margin="normal"
                            component={TextField}
                        />
                        <FormControl
                            fullWidth
                            required
                            margin="normal"
                        >
                            <InputLabel htmlFor="preferredSource">Preferred Source</InputLabel>
                            <Field
                                name="preferredSource"
                                id="preferredSource"
                                component={Select}
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                <MenuItem value="CIEL">CIEL</MenuItem>
                            </Field>
                        </FormControl>
                        <FormControl
                            fullWidth
                            required
                            margin="normal"
                        >
                            <InputLabel htmlFor="ownerUrl">Owner</InputLabel>
                            <Field
                                value=""
                                name="ownerUrl"
                                id="ownerUrl"
                                component={Select}
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                {profile ? <MenuItem value={profile.url}>{profile.username}(You)</MenuItem> : ''}
                                {usersOrgs.map(org => <MenuItem value={org.url}>{org.name}</MenuItem>)}
                            </Field>
                            <Typography color="error" variant="caption" component="div">
                                <ErrorMessage name="ownerUrl" component="span" />
                            </Typography>
                        </FormControl>
                        <FormControl
                            fullWidth
                            required
                            margin="normal"
                        >
                            <InputLabel htmlFor="visibility">Visibility</InputLabel>
                            <Field
                                name="visibility"
                                id="visibility"
                                component={Select}
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                <MenuItem value="View">Public</MenuItem>
                                <MenuItem value="None">Private</MenuItem>
                            </Field>
                            <Typography color="error" variant="caption" component="div">
                                <ErrorMessage name="visibility" component="span" />
                            </Typography>
                        </FormControl>
                        <FormControl
                            fullWidth
                            required
                            margin="normal"
                        >
                            <InputLabel htmlFor="preferredLanguage">Preferred Language</InputLabel>
                            <Field
                                name="preferredLanguage"
                                id="preferredLanguage"
                                component={Select}
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                {locales.map(({value, label}) => <MenuItem value={value}>{label}</MenuItem>)}
                            </Field>
                            <Typography color="error" variant="caption" component="div">
                                <ErrorMessage name="preferredLanguage" component="span" />
                            </Typography>
                        </FormControl>
                        <FormControl
                            fullWidth
                            required
                            margin="normal"
                        >
                            <InputLabel htmlFor="otherLanguages">Other Languages</InputLabel>
                            <Field
                                multiple
                                value={[]}
                                name="otherLanguages"
                                id="otherLanguages"
                                component={Select}
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                {locales.map(({value, label}) => <MenuItem value={value}>{label}</MenuItem>)}
                            </Field>
                            <Typography color="error" variant="caption" component="div">
                                <ErrorMessage name="otherLanguages" component="span" />
                            </Typography>
                        </FormControl>
                        <br/>
                        <br/>
                        <div id="submit-button">
                            <Button
                                variant="outlined"
                                color="primary"
                                size="medium"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                Submit
                            </Button>
                            {!status ? <br/> : (
                                <Typography color="textSecondary" variant="caption" component="span">
                                    {status}
                                </Typography>
                            )}
                            {!error ? <br/> : (
                                <Typography color="error" variant="caption" component="span">
                                    {error}
                                </Typography>
                            )}
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
};

export default DictionaryForm;
