let database;

export const openDatabase = () => {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open('TaskPulseMate', 1);
        request.onupgradeneeded = (event) => {
            database = event.target.result;
            if (!database.objectStoreNames.contains('Tasks')) database.createObjectStore('Tasks', { keyPath: 'id', autoIncrement: true });
        };
        request.onsuccess = (event) => {
            resolve('Database opened successfully!');
            database = event.target.result;
        }
        request.onerror = (event) => {
            console.error('Database error: ', event.target.errorCode);
            reject(event.target.errorCode);
        }
    });
}

// Creates new Record/Task in indexDB
export const createRecord = (Task) => {
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(['Tasks'], 'readwrite');
        const objectStore = transaction.objectStore('Tasks');
        const request = objectStore.add({ Task, IsComplete: false });
        request.onsuccess = async () => {
            console.log('Task Added Successfully');
            resolve(await getAllTasks());
        }
        request.onerror = (event) => {
            console.error('Error Creating Task:', event.target.errorCode);
            reject(event.target.errorCode);
        }
    });
}

// Retrieves Records/Tasks in indexDB
export const getAllTasks = () => {
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(['Tasks'], 'readonly');
        const objectStore = transaction.objectStore('Tasks');
        const request = objectStore.getAll();
        request.onsuccess = () => {
            // console.log('Tasks Retrieved:', request.result);
            resolve(request.result);
        }
        request.onerror = (event) => {
            console.error('Error Retrieving Tasks:', event.target.errorCode);
            reject(event.target.errorCode);
        }
    });
}

// Updates Records/Tasks in indexDB
export const updateRecord = (task) => {
    const transaction = database.transaction(['Tasks'], 'readwrite');
    const objectStore = transaction.objectStore('Tasks');
    const request = objectStore.put(task);
    request.onsuccess = () => console.log('Task Updated Successfully');
    request.onerror = (event) => console.error('Error Updating Task:', event.target.errorCode);
};

// Deletes Records/Tasks in indexDB
export const deleteRecord = (id) => {
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(['Tasks'], 'readwrite');
        const objectStore = transaction.objectStore('Tasks');
        const request = objectStore.delete(id);
        request.onsuccess = async () => {
            console.log('Task deleted successfully');
            resolve(await getAllTasks());
        }
        request.onerror = (event) => {
            console.error('Error deleting task:', event.target.errorCode);
            reject(event.target.errorCode);
        }
    });
}