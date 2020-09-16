import React from 'react';
import ContainerReleasedVersions from '../ContainerReleasedVersions';
import {render, fireEvent, getByText} from '../../../../test-utils';
import '@testing-library/jest-dom'
import { Version } from '../../../../utils';

type releasedVersionProps = React.ComponentProps<typeof ContainerReleasedVersions>;

const baseProps: releasedVersionProps = {
    versions: [],
    showCreateVersionButton: true,
    createVersion: function createVersion() {
    },
    createVersionLoading: true,
    createVersionError: {detail: "error"},
    url: "Dictionary url",
    editVersion: function editVersion() {
    },
    type: "Dictionary"
};

function renderUI(props: Partial<releasedVersionProps> = {}) {
    return render(
        <ContainerReleasedVersions {...baseProps} {...props}/>
    );
}

const releasedVersion: Version = {
    id: "2",
    released: true,
    description: "url",
    external_id: "3"
};
const unreleasedVersion: Version = {
    id: "2",
    released: false,
    external_id: "3",
    description: "url"
};

describe("ReleasedVersions", () => {
    it('should match snapshot', () => {
        const {container} = renderUI({
            versions: [releasedVersion],
            showCreateVersionButton: true
        });

        expect(container).toMatchSnapshot();
    })
});

describe("Dictionary release version table", () => {
    it('checks if table headers are as expected', () => {
        const headerRow: Array<string> = [
            "ID",
            "Date Created",
            "Description",
            "Release Status",
            "Actions"
        ];
        const {getByText} = renderUI({
            versions: [releasedVersion]
        });

        headerRow.forEach(function (header) {
            expect(getByText(header)).toBeInTheDocument();
        });
    });
});

describe("toggleButton for dictionary release status", () => {
    it('check if toggle button is present', () => {
        const {container} = renderUI({
            versions: [releasedVersion]
        });
        const toggleBtnElement = container.querySelector("[data-testid='2']");

        expect(toggleBtnElement).not.toBeNull();
    });

    it('check if toggle button is enabled for an released dictionary', () => {
        const {container} = renderUI({
            versions: [releasedVersion]
        });
        const toggleBtnElement: HTMLElement | null = container.querySelector("[data-testid='2']");

        expect(toggleBtnElement != null && toggleBtnElement.closest('span')).toHaveClass('Mui-checked');
    });

    it('check if toggle button is unchecked for an unreleased dictionary', () => {
        const {container} = renderUI({
            versions: [unreleasedVersion]
        });
        const toggleBtnElement: HTMLElement | null = container.querySelector("[data-testid='2']");

        expect(toggleBtnElement != null && toggleBtnElement.closest('span')).not.toHaveClass('Mui-checked');
    });

    it('check if onclick of dictionary toggle button opens confirmation dialog', () => {
        const {getByRole, getByTestId} = renderUI({
            versions: [unreleasedVersion],
            showCreateVersionButton: true
        });

        getByRole('checkbox').click();
        const dialog = getByTestId('confirm-dialog');
        expect(dialog).toBeTruthy();
    });

    it('check if confirmation dialog for releasing unreleased dictionary contains correct confirmation message', () => {
        const { getByRole, getByTestId} = renderUI({
            versions: [unreleasedVersion],
            showCreateVersionButton: true
        });

        getByRole('checkbox').click();
        const dialog = getByTestId('confirm-dialog');
        expect(getByText( dialog,"Are you sure to mark version")).toBeInTheDocument();
        expect(getByText( dialog,"released")).toBeInTheDocument();
        expect(getByText( dialog,"2")).toBeInTheDocument();
    });

    it('check if confirmation dialog for un releasing released dictionary contains correct confirmation message', () => {
        const { getByRole, getByTestId} = renderUI({
            versions: [releasedVersion],
            showCreateVersionButton: true
        });

        getByRole('checkbox').click();
        const dialog = getByTestId('confirm-dialog');
        expect(getByText( dialog,"Are you sure to mark version")).toBeInTheDocument();
        expect(getByText( dialog,"unreleased")).toBeInTheDocument();
        expect(getByText( dialog,"2")).toBeInTheDocument();
    });

    it('check if onclick of released dictionary dialog yes button makes the required function call', () => {
        const spyOnEditVersion = jest.fn();
        const { getByRole, getByTestId} = renderUI({
            versions: [releasedVersion],
            showCreateVersionButton: true,
            editVersion: spyOnEditVersion
        });
        getByRole('checkbox').click();
        const dialog = getByTestId('confirm-dialog');
        getByText(dialog,"Yes").click();
        expect(spyOnEditVersion).toBeCalledWith({"id": "2", "released": false});
    });

    it('check if onclick of unreleased dictionary dialog no button does not change the status to released', () => {
        const spyOnEditVersion = jest.fn();
        const { getByRole, getByTestId} = renderUI({
            versions: [unreleasedVersion],
            showCreateVersionButton: true,
            editVersion: spyOnEditVersion
        });
        getByRole('checkbox').click();
        const dialog = getByTestId('confirm-dialog');
        getByText(dialog,"No").click();
        expect(getByTestId('2').closest('span')).not.toHaveClass('Mui-checked');
        expect(spyOnEditVersion).not.toBeCalled();
    });
});

describe('when user is not the owner of sources', () => {
    it('should not open confirmation dialog onclick of dictionary toggle button', () => {
        const {container, getByRole, getByTestId} = renderUI({
            versions: [unreleasedVersion],
            showCreateVersionButton: false
        });
        getByRole('checkbox').click();
        const dialog = container.querySelector('[data-testid="confirm-dialog"]');
        expect(dialog).toBeNull();
        expect(getByTestId('2').closest('span')).not.toHaveClass('Mui-checked');
    });

    it("should show tooltip with valid message on hovering the toggle button", async () => {
        const {getByTestId} = renderUI({
            versions: [unreleasedVersion],
            showCreateVersionButton: false
        });
        const toggleButton: HTMLElement | null = getByTestId('2').closest('span');
        expect(toggleButton).not.toBeNull();
        toggleButton !== null && fireEvent.mouseMove(toggleButton);
        expect(toggleButton).toHaveAttribute("title", "You don't have permission to change the status");
    });
});

describe('actions button', () => {
    it('should give both options on click of actions button for a released version', () => {
        const {getByTestId} = renderUI({
            versions: [releasedVersion],
            showCreateVersionButton: false
        });
        getByTestId("more-actions").click();
        expect(getByTestId("view-concepts")).toBeInTheDocument();
        expect(getByTestId("copy-subscription-url")).toBeInTheDocument();
    });

    it("should give only view concepts option on click of actions button for an unreleased version", () => {
        const {container, getByTestId} = renderUI({
            versions: [unreleasedVersion],
            showCreateVersionButton: true
        });
        getByTestId("more-actions").click();
        const copyOptionElement: HTMLElement | null = container.querySelector("[data-testid='copy-subscription-url']");
        expect(getByTestId("view-concepts")).toBeInTheDocument();
        expect(copyOptionElement).toBeNull();
    });
});

