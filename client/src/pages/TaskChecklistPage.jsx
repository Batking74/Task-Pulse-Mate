// Importing Modules/Packages
import { createRecord, deleteRecord, getAllTasks, openDatabase, updateRecord } from "../helpers/database";
import { useEffect, useState } from "react";

export default function TaskChecklistPage() {
    // Declaring Variables/State Variables
    const [InputValue, setInputValue] = useState('');
    const [IsComplete, setIsComplete] = useState('');
    const [Tasks, setTasks] = useState([]);

    // Creates a new Task in IndexDB
    const createTask = async (e) => {
        e.preventDefault();
        if (InputValue.length != '') {
            try {
                const newArray = await createRecord(InputValue);
                e.target.children[0].value = '';
                setTasks(newArray);
                setInputValue('');
            }
            catch (error) {
                console.error('Error Occurred creating Task: ', error);
                throw error;
            }
        }
    }

    // Deletes a Task from IndexDB
    const deleteTask = async (e) => {
        try {
            const targetId = parseInt(e.target.id.split('-')[1]);
            const response = await deleteRecord(targetId);
            setTasks(response);
        }
        catch (error) {
            console.error('Error Deleting Task: ', error);
            throw error;
        }
    }

    // Updates a Task in IndexDB
    const updateTask = ({ target }) => {
        const id = parseInt(target.id.split('-')[1]);
        const index = Tasks.findIndex(task => task.id == id);
        if (!Tasks[index].IsComplete) {
            Tasks[index].IsComplete = true;
            setIsComplete(Tasks[index].IsComplete);
            updateRecord(Tasks[index]);
        }
        else {
            Tasks[index].IsComplete = false;
            setIsComplete(Tasks[index].IsComplete);
            updateRecord(Tasks[index]);
        }
    }

    // Retrieves all Tasks in IndexDB
    useEffect(() => {
        const getTasks = async () => {
            try {
                console.log(await openDatabase());
                const data = await getAllTasks();
                setTasks(data);
            }
            catch (error) {
                console.error('Error Retrieving Tasks: ', error);
                throw error;
            }
        }
        getTasks();
    }, [IsComplete]);

    return (
        <main id="MelonEShield-Container">
            <h1>Task Pulse Mate</h1>
            <div className="wrapper">
                <form onSubmit={createTask} id="Checklist-form">
                    <input
                        onInput={({ target }) => setInputValue(target.value)}
                        autoComplete="off"
                        placeholder="Create a new Task"
                        type="text"
                        id="create-SecurityMeasure-input" />
                    <button id="create-button">Create</button>
                </form>
                <ul id="Security-Checklist">
                    {
                        Tasks.map(({ Task, IsComplete, id }) => {
                            const identifier = `SecurityMeasure-${id}`;
                            return (
                                <li key={id} className="SecurityMeasure" >
                                    <input onChange={updateTask} checked={IsComplete} type="checkbox" id={identifier} />
                                    <label className="custom-checkbox" htmlFor={identifier}><box-icon name='check'></box-icon></label>
                                    <label htmlFor={identifier} className="SecurityMeasure-text">{Task}</label>
                                    <button aria-label="delete-button" className="delete-button">
                                        <box-icon onClick={deleteTask} id={`${identifier}-delete`} color='#4A4D57' name='trash'></box-icon>
                                    </button>
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        </main >
    );
}