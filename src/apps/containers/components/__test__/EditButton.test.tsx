import {render} from "@testing-library/react";
import {Provider} from "react-redux";
import store from "../../../../redux";
import {BrowserRouter as Router} from "react-router-dom";
import * as React from "react";
import {EditButton} from "../EditButton";

type editButtonProps = React.ComponentProps<typeof EditButton>;

const baseProps: editButtonProps = {
    url: "url",
    title:"edit"
};
function renderUI(props: Partial<editButtonProps> = {}) {
    return render(<Provider store={store}>
            <Router>
                <EditButton {...baseProps} {...props}  />
            </Router>
        </Provider>
    );
}

describe('EditButton', () => {
    it('EditButton snapshot test', () => {
        const {container} = renderUI();
        expect(container).toMatchSnapshot();
    });
});