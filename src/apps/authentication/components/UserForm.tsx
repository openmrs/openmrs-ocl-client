import React, { useEffect, useRef } from "react";
import {
    makeStyles
} from "@material-ui/core";
import { Field, Form, Formik} from "formik";
import { TextField } from "formik-material-ui";
import { APIProfile } from "../types";
import moment from 'moment';

interface Props {
    loading: boolean;
    savedValues?: APIProfile;
}

const initialValues: APIProfile = {
    username: "",
    name: "",
    email: "",
    company: "",
    location: "",
    created_on: ""
};


const useStyles = makeStyles({
    userForm: {
        padding: "2vh 2vw"
    }
});

const UserForm: React.FC<Props> = ({
                                         loading,
                                         savedValues
                                     }) => {
    const classes = useStyles();
    const formikRef: any = useRef(null);

    useEffect(() => {
        const { current: currentRef } = formikRef;
        if (currentRef) {
            currentRef.setSubmitting(loading);
        }
    }, [loading]);

    return (
        <div id="user-form" className={classes.userForm}>
            <Formik
                ref={formikRef}
                initialValues={savedValues || initialValues}
                validateOnChange={false}
                onSubmit={(values: APIProfile) => {
                }}
            >
                {({ values }) => (
                    <Form>
                        <Field
                            fullWidth
                            autoComplete="off"
                            id="username"
                            name="username"
                            label="User Name"
                            margin="normal"
                            multiline
                            rowsMax={4}
                            component={TextField}
                        />
                        <Field
                            fullWidth
                            autoComplete="off"
                            id="name"
                            name="name"
                            label="Full Name"
                            margin="normal"
                            multiline
                            rowsMax={4}
                            component={TextField}
                        />
                        <Field
                            fullWidth
                            autoComplete="off"
                            id="email"
                            name="email"
                            label="Email ID"
                            margin="normal"
                            multiline
                            rowsMax={4}
                            component={TextField}
                        />
                        <Field
                            fullWidth
                            autoComplete="off"
                            id="company"
                            name="company"
                            label="Company"
                            margin="normal"
                            multiline
                            rowsMax={4}
                            component={TextField}
                        />
                        <Field
                            fullWidth
                            autoComplete="off"
                            id="location"
                            name="location"
                            label="Location"
                            margin="normal"
                            multiline
                            rowsMax={4}
                            component={TextField}
                        />
                        <Field
                            fullWidth
                            autoComplete="off"
                            id="joinedDate"
                            name="joinedDate"
                            defaultValue={values.created_on ? moment(values.created_on).format("DD MMM YYYY") : ""}
                            label="Joined Date"
                            margin="normal"
                            disabled
                            component={TextField}
                        />
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default UserForm;
