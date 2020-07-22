import {mapDispatchToProps, mapStateToProps} from "../../pages/ViewOrgSourcesPage";
import {retrieveOrgSourcesAction} from "../../redux";
import {currentState, orgSources, testSource} from '../test_data';


const appState = currentState(orgSources);
describe('ViewOrgSourcesPage', () => {

    it('should list down all the props of the state', () => {
        expect(mapStateToProps(appState).loading).not.toBeNull();
        expect(mapStateToProps(appState).sources).not.toBeNull();
        expect(mapStateToProps(appState).meta).not.toBeNull();
    });

    it('should update the loading status with current state', () => {
        expect(mapStateToProps(appState).loading).toEqual(false);
    });

    it('should assign existing sources to the sources prop', () => {
        expect(mapStateToProps(appState).sources).toEqual([testSource]);
    });

    it('should update the response meta data from the current state', () => {
        expect(mapStateToProps(appState).meta).toEqual({key: false});
    });

    it('should point to correct dispatch action', () => {
        expect(mapDispatchToProps.retrieveSources).toBe(retrieveOrgSourcesAction);
    })
});