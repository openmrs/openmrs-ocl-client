import React from "react";
import UserForm from "../../components/UserForm";
import {render} from "../../../../test-utils";
import {BrowserRouter as Router} from "react-router-dom";
import {testProfile} from "../test_data";

type userFormProps = React.ComponentProps<typeof UserForm>;

const baseProps: userFormProps = {
    loading: true,
    savedValues: testProfile
};

function renderUI(props: Partial<userFormProps> = {}) {
    return render(
        <Router>
            <UserForm {...baseProps} {...props} />
        </Router>
    );
}

describe("UserForm", () => {
    it("should match snapshot", () => {
        const {container} = renderUI(baseProps);

        expect(container).toMatchSnapshot();
    });
    it('should show correct User Name', () => {
        const {getByLabelText} = renderUI();
        const header = getByLabelText('User Name');

        expect(header.textContent).toBe("TestUser");
    });
    it('should show correct Full name', () => {
        const {getByLabelText} = renderUI();
        const header = getByLabelText('Full Name');

        expect(header.textContent).toBe("TestUser");
    });
    it('should show correct Email ID', () => {
        const {getByLabelText} = renderUI();
        const header = getByLabelText('Email ID');

        expect(header.textContent).toBe("TestUser@test.com");
    });
    it('should show correct Company', () => {
        const {getByLabelText} = renderUI();
        const header = getByLabelText('Company');

        expect(header.textContent).toBe("Test Company");
    });
    it('should show correct Location', () => {
        const {getByLabelText} = renderUI();
        const header = getByLabelText('Location');

        expect(header.textContent).toBe("Test Location");
    });
    it('should show correct Joined Date', () => {
        const {getByLabelText} = renderUI();
        const header = getByLabelText('Joined Date');

        // @ts-ignore
        expect(header.value).toBe("01 Jan 1900");
    });
});