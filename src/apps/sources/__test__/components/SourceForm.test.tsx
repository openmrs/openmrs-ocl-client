import React from "react";
import SourceForm from "../../components/SourceForm";
import {APIOrg, APIProfile} from "../../../authentication";
import {Source} from "../../types";
import {render} from "@testing-library/react";
import {BrowserRouter as Router} from "react-router-dom";

type sourcesFormProps = React.ComponentProps<typeof SourceForm>;

const apiProfile :APIProfile = {
    email: "", organizations_url: "", url: "", username: ""
};
const apiOrg :APIOrg = {
    id: "", name: "", url: ""
};

const testSource : Source ={
    custom_validation_schema: "",
    default_locale: "en",
    description: "Testing Description",
    external_id: "12",
    name: "Test",
    public_access: "View",
    short_code: "12",
    source_type: "MSF",
    supported_locales: ["fr","es"],
    website: "website"
};

const baseProps: sourcesFormProps = {
    onSubmit: function onSubmit(){
    },
    loading: true,
    status: "",
    profile: apiProfile,
    usersOrgs: [apiOrg],
    errors: [],
    savedValues: testSource,
};

function renderUI(props: Partial<sourcesFormProps> = {}) {
    return render(
        <Router>
            <SourceForm {...baseProps} {...props} />
        </Router>
    );
}

describe('SourceForm', () => {
   it('snapshot test', () => {
       const {container} = renderUI();
       expect(container).toMatchSnapshot();
   });
   it('should populate mandatory field values', () => {
       const {getByLabelText} = renderUI();
       // @ts-ignore
       expect(getByLabelText('Short Code').value).toBe('12');
       // @ts-ignore
       expect(getByLabelText('Source Name').value).toBe('Test');

   });
    it('should populate non mandatory field values', () => {
       const {getByLabelText} = renderUI();
       // @ts-ignore
       expect(getByLabelText('Description').value).toBe('Testing Description');
       // @ts-ignore
       expect(getByLabelText('Website').value).toBe('website');
       // @ts-ignore
        expect(getByLabelText('Source type').value).toBe('MSF');
   });
});
