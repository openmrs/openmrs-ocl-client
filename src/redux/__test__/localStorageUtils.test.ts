import {
    createLocalStorageObject,
    getLocalStorageObject,
    updateLocalStorageArray
} from "../localStorageUtils";

describe('localStorageUtils',() => {

    const mockLocalStorage = (getItem: any) => {
        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: jest.fn(() => getItem),
                setItem: jest.fn(() => null)
            },
            writable: true
        });
    };

    it('should create a new object in local storage if there is no existing object with `notification` name ',() => {
        mockLocalStorage(null);
        createLocalStorageObject("notification");
        expect(localStorage.getItem).toHaveBeenCalledTimes(8);
        expect(localStorage.setItem).toHaveBeenCalledTimes(7);
   });

    it('should not create a object in local storage if `notification` object is already there',() => {
        mockLocalStorage(JSON.stringify( 'test'));
        createLocalStorageObject("notification");
        expect(localStorage.getItem).toHaveBeenCalledTimes(1);
        expect(localStorage.setItem).toHaveBeenCalledTimes(0);
        expect(localStorage.getItem).toHaveBeenCalledWith("notification");
    });

    it('should call getItem once when local storage object has valid key',() => {
        mockLocalStorage(JSON.stringify(  {inProgress: ['abc'], indexList: [0]}));
        updateLocalStorageArray({name:'notification',key:'inProgress', value:'abc', index: 0});
        expect(window.localStorage.getItem).toHaveBeenCalledTimes(1);
        expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(window.localStorage.getItem).toHaveBeenCalledWith("notification");
    });

    it('should call getItem once if the notification object has invalid key',() => {
        mockLocalStorage(JSON.stringify(  {test: ['abc'], indexList: [0]}));
        updateLocalStorageArray({name:'notification',key:'inProgress', value:'abc', index: 0});
        expect(window.localStorage.getItem).toHaveBeenCalledTimes(1);
        expect(window.localStorage.setItem).toHaveBeenCalledTimes(0);
        expect(window.localStorage.getItem).toHaveBeenCalledWith("notification");
    });

    it('get local storage object for the name', () =>{
        mockLocalStorage(JSON.stringify(  {loadingList: ['abc']}));
        getLocalStorageObject({name: 'notification', key: 'loadingList', value: 'true'});
        expect(window.localStorage.getItem).toHaveBeenCalledTimes(1);
        expect(window.localStorage.setItem).toHaveBeenCalledTimes(0);
        expect(window.localStorage.getItem).toHaveBeenCalledWith("notification");
    });

});
