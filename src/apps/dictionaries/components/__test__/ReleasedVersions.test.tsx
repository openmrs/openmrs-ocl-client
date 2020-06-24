import React from 'react';
import ReleasedVersions from '../../../../apps/dictionaries/components/ReleasedVersions';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom'
import {
    BrowserRouter as Router,
} from "react-router-dom";

type releasedVersionProps = React.ComponentProps<typeof ReleasedVersions>;

const baseProps: releasedVersionProps = {
    versions: [],
    showCreateVersionButton: true,
    createDictionaryVersion: function createDictonaryVersion() {
    },
    createVersionLoading: true,
    createVersionError: {detail: "error"},
    dictionaryUrl: "Dictionary url"
};

function renderUI(props: Partial<releasedVersionProps> = {}) {
    return render(
        <Router>
            <ReleasedVersions {...baseProps} {...props} />
        </Router>
    );
}

describe("ReleasedVersions", () => {
    it('should match snapshot', () => {
        const {container} = renderUI({
            versions: [{
                id: "2",
                released: false,
                version_url: "version_url",
                url: "url",
                external_id: "3"
            }]
        });

        expect(container).toMatchSnapshot();
    });
    it('check if toggle button is present', () => {
        const {container} = renderUI({
            versions: [{
                id: "2",
                released: false,
                version_url: "version_url",
                url: "url",
                external_id: "3"
            }]
        });
        const toggleBtnElement = container.querySelector("[data-testid='2']");

        expect(toggleBtnElement).not.toBeNull();
    });
    it('check if toggle button is enabled for an released dictionary', () => {
        const {container} = renderUI({
            versions: [{
                id: "2",
                released: true,
                version_url: "version_url",
                url: "url",
                external_id: "3"
            }]
        });
        const toggleBtnElement: HTMLElement | null = container.querySelector("[data-testid='2']");

        expect(toggleBtnElement != null && toggleBtnElement.closest('span')).toHaveClass('Mui-checked');
    });
    it('check if toggle button is disabled for an unreleased dictionary', () => {
        const {container} = renderUI({
            versions: [{
                id: "2",
                released: false,
                version_url: "version_url",
                url: "url",
                external_id: "3"
            }]
        });
        const toggleBtnElement: HTMLElement | null = container.querySelector("[data-testid='2']");

        expect(toggleBtnElement != null && toggleBtnElement.closest('span')).not.toHaveClass('Mui-checked');
    })
});
