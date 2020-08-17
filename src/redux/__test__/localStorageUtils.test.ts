
import {
    createLocalStorageObject, getLocalStorageObject,
    setUpdate,
    updateLocalStorageArray
} from "../localStorageUtils";

describe('localStorageUtils',() => {
    it('should create a new object in local storage if there is no existing object with `notification` name ',() => {
        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: jest.fn(() => null),
                setItem: jest.fn(() => null)
            },
            writable: true
        });
        createLocalStorageObject("notification");
        expect(localStorage.getItem).toHaveBeenCalledTimes(6);
        expect(localStorage.setItem).toHaveBeenCalledTimes(5);
   });

    it('should not create a object in local storage if `notification` object is already there',() => {
        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: jest.fn(() => JSON.stringify( 'test')),
                setItem: jest.fn(() => null)
            },
            writable: true
        });
        createLocalStorageObject("notification");
        expect(localStorage.getItem).toHaveBeenCalledTimes(1);
        expect(localStorage.setItem).toHaveBeenCalledTimes(0);
        expect(localStorage.getItem).toHaveBeenCalledWith("notification");
    });



    it('should call getItem twice when local storage object has valid key',() => {

        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: jest.fn(() => JSON.stringify(  {inProgress: ['abc']})),
                setItem: jest.fn(() => null)
            },
            writable: true
        });
        updateLocalStorageArray({name:'notification',key:'inProgress', value:'abc', list:'test'});
        expect(window.localStorage.getItem).toHaveBeenCalledTimes(2);
        expect(window.localStorage.setItem).toHaveBeenCalledTimes(0);
        expect(window.localStorage.getItem).toHaveBeenCalledWith("notification");
    });

    it('should call getItem once if the notification object has invalid key',() => {

        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: jest.fn(() => JSON.stringify(  {test: ['abc']})),
                setItem: jest.fn(() => null)
            },
            writable: true
        });

        updateLocalStorageArray({name:'notification',key:'inProgress', value:'abc', list:'test'});
        expect(window.localStorage.getItem).toHaveBeenCalledTimes(1);
        expect(window.localStorage.setItem).toHaveBeenCalledTimes(0);
        expect(window.localStorage.getItem).toHaveBeenCalledWith("notification");
    });

    it('get local storage object for the name', () =>{
        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: jest.fn(() => JSON.stringify(  {loadingList: ['abc']})),
                setItem: jest.fn(() => null)
            },
            writable: true
        });
        getLocalStorageObject({name: 'notification', key: 'loadingList', value: 'true'});
        expect(window.localStorage.getItem).toHaveBeenCalledTimes(1);
        expect(window.localStorage.setItem).toHaveBeenCalledTimes(0);
        expect(window.localStorage.getItem).toHaveBeenCalledWith("notification");
    });

    it('should set value for `is update` to true when notification object has valid key',() => {
        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: jest.fn(() => JSON.stringify(  {inProgress: ['abc']})),
                setItem: jest.fn(() => null)
            },
            writable: true
        });
        setUpdate('notification', 'inProgress',"true");
        expect(window.localStorage.getItem).toHaveBeenCalledTimes(1);
        expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(window.localStorage.getItem).toHaveBeenCalledWith("notification");
    });

    it('should not set value for `is update` when the notification object is empty ',() => {
        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: jest.fn(() => null),
                setItem: jest.fn(() => null)
            },
            writable: true
        });
        setUpdate('notification', 'inProgress',"true");
        expect(window.localStorage.getItem).toHaveBeenCalledTimes(1);
        expect(window.localStorage.setItem).toHaveBeenCalledTimes(0);
        expect(window.localStorage.getItem).toHaveBeenCalledWith("notification");
    });

    it('should not set value for `is update` when the notification object has invalid key',() => {
        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: jest.fn(() => JSON.stringify(  {test: ['abc']})),
                setItem: jest.fn(() => null)
            },
            writable: true
        });
        setUpdate('notification', 'inProgress',"true");
        expect(window.localStorage.getItem).toHaveBeenCalledTimes(1);
        expect(window.localStorage.setItem).toHaveBeenCalledTimes(0);
        expect(window.localStorage.getItem).toHaveBeenCalledWith("notification");
    });
});
