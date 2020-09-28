import {ImportMetaData} from "../apps/dictionaries";

export function createLocalStorageObject(name: string){
    try {
        const existing = localStorage.getItem(name);
        if (!existing) {
            setLocalStorageObject('notification', 'inProgressList', []);
            setLocalStorageObject('notification', 'loadingList', []);
            setLocalStorageObject('notification', 'erroredList', []);
            setLocalStorageObject('notification', 'successList', []);
            setLocalStorageObject('notification', 'index', -1);
            setLocalStorageObject('notification', 'indexList', []);
            setLocalStorageObject('notification', 'importMetaDataList', []);
        }
    }catch (error) {
        console.log(error);
    }
};

function setLocalStorageObject(name: string, key: string, value: any) {
    const existing = localStorage.getItem(name);
    let existingObject = existing ? JSON.parse(existing) : {};
    existingObject[key] = value;
    localStorage.setItem(name, JSON.stringify(existingObject));
};

export function addToLocalStorageObject(name: string, key: string, value: string | boolean | null | ImportMetaData) {
    try {
        const existing = localStorage.getItem(name);
        let existingObject = existing ? JSON.parse(existing) : {};
        if (existingObject[key]) {
            if (existingObject[key].length >= 10)
                existingObject[key].shift();
            existingObject[key].push(value);
        }
        if (key === 'inProgressList') {
            const index = existingObject['index'] + 1;
            existingObject['index'] = index;
            if (existingObject['indexList'].length >= 10)
                existingObject['indexList'].shift();
            existingObject['indexList'].push(index);
        }
        localStorage.setItem(name, JSON.stringify(existingObject));
        return existingObject['index'];
    } catch(error){
        console.log(error);
    }
};

export function updateLocalStorageArray({name,key, value, index}: { name: string, key: string, value: any, index: number }) {
    try {
        const retrievedData = localStorage.getItem(name);
        let retrievedDataJsonObject = retrievedData ? JSON.parse(retrievedData) : {};

        if (!retrievedDataJsonObject[key]) {
            return;
        }

        const getActualIndex = (element: number) => element ===  index;
        const actualIndex = retrievedDataJsonObject['indexList'].findIndex(getActualIndex);
        retrievedDataJsonObject[key][actualIndex] = value;
        localStorage.setItem(name, JSON.stringify(retrievedDataJsonObject));
    } catch(error){
        console.log(error);
    }

};

export function getLocalStorageObject({name,key, value}: { name: string, key: string, value: any }) {
   try {
       const retrievedData = localStorage.getItem(name);
       let retrievedDataJsonObject = retrievedData ? JSON.parse(retrievedData) : {};
       if (!retrievedDataJsonObject[key]) {
           return value;
       }
       return retrievedDataJsonObject[key];
   } catch(error){
       console.log(error);
       return value;
   }
};
