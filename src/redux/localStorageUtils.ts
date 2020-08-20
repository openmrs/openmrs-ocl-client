export function createLocalStorageObject(name: string){
    try {
        const existing = localStorage.getItem(name);
        if (!existing) {
            setLocalStorageObject('notification', 'inProgressList', []);
            setLocalStorageObject('notification', 'loadingList', []);
            setLocalStorageObject('notification', 'erroredList', []);
            setLocalStorageObject('notification', 'successList', []);
            setLocalStorageObject('notification', 'isUpdate', "false");
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

export function addToLocalStorageObject(name: string, key: string, value: string) {
    try {
        const existing = localStorage.getItem(name);
        let existingObject = existing ? JSON.parse(existing) : {};
        if (existingObject[key]) {
            if (existingObject[key].length >= 10)
                existingObject[key].shift();
            existingObject[key].push(value);
        }
        localStorage.setItem(name, JSON.stringify(existingObject));
    } catch(error){
        console.log(error);
    }
};

export function updateLocalStorageArray({name,key, value, list}: { name: string, key: string, value: any, list: any }) {
    try {
        const retrievedData = localStorage.getItem(name);
        let retrievedDataJsonObject = retrievedData ? JSON.parse(retrievedData) : {};

        if (!retrievedDataJsonObject[key]) {
            return list;
        }

        if (getLocalStorageObject({name: 'notification', key: 'isUpdate', value: 'false'}) === "false") {
            return retrievedDataJsonObject[key];
        }
        retrievedDataJsonObject[key][retrievedDataJsonObject[key].length - 1] = value;
        localStorage.setItem(name, JSON.stringify(retrievedDataJsonObject));
        return retrievedDataJsonObject[key];
    } catch(error){
        console.log(error);
        return list;
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

export function setUpdate(name: string, key: string, value: any ) {
    try {
        const retrievedData = localStorage.getItem(name);
        let retrievedDataJsonObject = retrievedData ? JSON.parse(retrievedData) : {};
        if (!retrievedDataJsonObject[key]) {
            return "false";
        }
        retrievedDataJsonObject['isUpdate'] = value;
        localStorage.setItem(name, JSON.stringify(retrievedDataJsonObject));
    } catch(error){
        console.log(error);
    }
};


