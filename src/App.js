import Header from './components/Header'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import Footer from './components/Footer'
import {useState} from 'react'
import {useEffect} from 'react'   // Deals with side-effects, Component needs to do something AFTER rendering

// Components can be Functions (with hooks) or Classes
function App() {

// App (Global) State.
// Not best practice, will use Redux to keep track of JS States in future

    // tasks is RETURNED stateful value, default will be initialState (when event not triggered yet)
    // setTasks is function to change State. Reusable in different contexts
    // initialize useState to default value as seen below
    const [tasks, setTasks] = useState([])      // Fetch data from db.json, so empty brackets here
    const [showAddButton, setshowAddButton] = useState(false)

    // UseEffect function. Input is the function you passed in (the effect you want to create).
    // React will call this function after the DOM updates
    useEffect( () => {
        // First Argument of useEffect (the function that causes the Effect)
        const getTasks = async() => {
               const TasksFromServer = await(fetchTasks())          // Fetch tasks from Backend Server (Port 5000)
               setTasks(TasksFromServer)                            // Update on GUI using State Hook function
        }

        // Actually run getTasks(), whatever was above is just a definition
        getTasks()
        },

        // Second Argument of useEffect
        []  // Optional Dependency Array (2nd argument of useEffect). Effect will only execute when value here is different from previous update
    )

    // fetchTasks (from Server) function, declared outside so that we can reuse it in other places
    const fetchTasks = async() => {                                           // async keyword, put infront of function keyword to turn it into async function// Invoking the async function now, returns a promise (async function return values guaranteed to be promises)
        // We use asynchronous function here as HTTP requests take alot of time, so the function will run in the background (it won't pause execution of entire programme)
        // It is similar to non-blocking assignment in Verilog

        // await keyword only works inside async functions
        // await can be put infront of any async promise-based function, to pause code on that line until the promise fufills, then it returns the resulting value
        const response = await fetch('http://localhost:5000/tasks')   // Fetches resources from a Network Location
        const data = await response.json()    // When exchanging data between browser and server, the data can only be text. JSON servers as intermediary.
                                              // Can replace with any backend here, to fetch data
        // Return the data for handling
        return data
    }

    const fetchSpecificTask = async(id) => {
        const response = await fetch(`http://localhost:5000/tasks/${id}`)
        const data = await response.json()
        return data
    }

    // Function to toggle Reminders on Task
    // Supports Backend Integration as well
    const toggleReminder = async (id) =>
    {
        // Fetch SPECIFIC DATA from Backend, (which task needs it's reminder to be toggled?)
        const TaskToToggle = await fetchSpecificTask(id)

        // Update the SPECIFIC DATA that has just been fetched
        // 1. Use Spread Operator to copy over fetched data
        // 2. Accessing the reminder field, change it to the opposite of JUST FETCHED DATA'S REMINDER! In this case it is TaskToToggle
        const updatedTaskToToggle = {...TaskToToggle, reminder : !TaskToToggle.reminder }

        // Push the Updated Data onto Backend Server
        const response = await fetch(`http://localhost:5000/tasks/${id}`, {
            method : 'PUT',
            headers : { 'Content-type' : 'application/json',},
            body : JSON.stringify(updatedTaskToToggle),
            }
        )

        const data = await response.json()

        // Reflect updated Data on UI
        setTasks( tasks.map(
            (ReminderTasks) => (            // ReminderTasks is the "placeholder" for the current element, as you iterate through List
                ReminderTasks.id === id ?
                    {
                        ...ReminderTasks, reminder : data.reminder    // Rest Operator
                    } : ReminderTasks
            )
        ))
    }

    // Function to add Task
    const onAdd = async(TaskAdded) => {
        // ADD request to Backend Server, causing db.json to be modified also!
        const serverData = await fetch('http://localhost:5000/tasks' , {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(TaskAdded),                     // Convert TaskAdded (input) into JSON format, for adding into Backend Database
        })

        /* Why don't we just add TaskAdded directly using the Redundant Method?
        We first wait for the data to be added to Backend Server, before we update it in the UI. That flows better
         */
        const JSData = await serverData.json()    // Convert JSON format back to JS
        setTasks( [...tasks, JSData])       // tasks is the Stateful Value. JSData can be replaced with TaskAdded

        /* REDUNDANT METHOD TO ADD TASKS, WE WILL USE JSON-SERVER
        // Function to add Task
        // Input TaskAdded does not need to be explicitly defined in App.js (it is just a placeholder, like C)
        // TaskAdded input is dependent on AddTask.js (it is task, date, reminder)
        // Without a database, we will simply use RNG to store the different Tasks
        const id = Math.floor(Math.random() * 10000) + 1

        // Create an Object representing newly added Task, using spread operator for TaskAdded (containing text,day,reminder)
        const newTask = {id, ...TaskAdded}

        // Define (reuse) the setTasks function to include the new task
        // Copy over the pre-existing TASKS (the Stateful Value above)
        // Append newTask to it
        setTasks( [...tasks, newTask])
         */
    }

    // Function to delete Task (known as deleteTask in Tasks.js / Task.js, since that is what we called it as a Prop)
    // Supports additional functionality (deleting Task from Backend db.json Database as well)
    const deleteTask = async(id) => {
        // DELETE request from Backend Server, this causes db.json to be modified also!
        await fetch(`http://localhost:5000/tasks/${id}` ,{method : 'DELETE'} )  // Note backticks and String Template
        // Delete from UI
        setTasks( tasks.filter( (FilteredTask) => FilteredTask.id !== id ) )
    }

  // Return is JSX, not HTML
  // Can only return one single Parent Element

  /* Pass in deleteTask function as Prop, to Tasks.js
     - Tasks.js contains Task.js
     - Task.js contains the button itself, that is the trigger point for deletion

     Pass in addTask function as Prop, to AddTask.js
   */
  return (
    <div className = 'container'>

        <Header
            buttonColorDecider = {showAddButton}
            toggleAdd = { () => setshowAddButton(!showAddButton) }/>      {/* Button is in <Header>, so we must pass down the State Hook function as a Prop. We also define the State Hook function here */}
        {showAddButton ? <AddTask onAdd = {onAdd}/> : ''}                 {/* Event Handlers must be function or function reference, for setshowAddButton*/}
        {
           tasks.length !== 0 ?
               (
                   <Tasks
                       tasks = {tasks}         /* Passing in tasks as Prop */
                       onDelete = {deleteTask} /* Passing in deleteTask (FUNCTION) as Prop, into variable onDelete */
                       toggleReminder = {toggleReminder}
                   />
               )
               :
               'No Tasks Today!'
        }

        <Footer />

    </div>
  );
}

export default App;
