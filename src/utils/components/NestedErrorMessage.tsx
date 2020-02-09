import React from 'react'
import { Field, getIn } from 'formik'

const NestedErrorMessage = ({ name }: { name: string }) => (
  <Field
    name={name}
    // @ts-ignore
    render={({ form }) => {
      const error = getIn(form.errors, name);
      const touch = getIn(form.touched, name);
      return touch && error ? <span>{error}</span> : null;
    }}
  />
);

export default NestedErrorMessage;
