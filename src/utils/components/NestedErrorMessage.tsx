import { Field, FormikState, getIn } from "formik";

const NestedErrorMessage = ({ name }: { name: string }) => (
  <Field
    variant="standard"
    name={name}
    render={({ form }: { form: FormikState<any> }) => {
      const error = getIn(form.errors, name);
      const touch = getIn(form.touched, name);
      return touch && error ? <span>{error}</span> : null;
    }}
  />
);

export default NestedErrorMessage;
