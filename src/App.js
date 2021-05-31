import Header from './components/Header'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import {useEffect, useState} from 'react' // Deals with side-effects, Component needs to do something AFTER rendering
import Authentication from './components/Authentication'
import Axios from "axios"
import useAxios from 'axios-hooks'

// App (Global) State.
// Not best practice, will use Redux to keep track of JS States in future
// Components can be Functions (with hooks) or Classes
function App() {
    const [tasks, setTasks] = useState( [])
    const [showAddButton, setshowAddButton] = useState(false)
    const [isAuth, setisAuth] = useState(false)

    useEffect(() => {
            const getTasks = async () => {
                const TasksFromServer = await (fetchTasks())
                setTasks(TasksFromServer)
            }
            getTasks()
        }, [isAuth]
    )

    // fetchTasks (from Server) function, declared outside so that we can reuse it in other places
    const fetchTasks = async() => {
        /*Axios({
            method : "GET",
            withCredentials : true,
            url :"http://localhost:4000/tasks"
        }).then((res) => {
            console.log("Hi")
            console.log(res.data)
        })*/
        const response = await Axios.get('http://localhost:4000/tasks')
        return response
    }

    const onAdd = (TaskAdded) => {
        Axios({
            method : "POST",
            data : TaskAdded,
            withCredentials : true,
            url: "http://localhost:4000/tasks",
        }).then((res) => {
            setTasks([...tasks, TaskAdded])
        })
    }

    const deleteTask = async(TaskDelete) => {
        Axios({
            method : "DELETE",
            data : TaskDelete,
            withCredentials : true,
            url : "http://localhost:4000/tasks",
        }).then((res) => {
            // Update UI
        })
    }

  // Return is JSX, not HTML
  // Can only return one single Parent Element
  return (
      <>
          {!isAuth && <Authentication setisAuth = {setisAuth} />}

          {isAuth &&
              <div className='container'>
                  <Header
                      buttonColorDecider={showAddButton}
                      toggleAdd={() => setshowAddButton(!showAddButton)}
                  /> {/* Button is in <Header>, so we must pass down the State Hook function as a Prop. We also define the State Hook function here */}

                  {showAddButton ? <AddTask
                      onAdd={onAdd}/> : ''} {/* Event Handlers must be function or function reference, for setshowAddButton*/}
                  {
                      tasks.length !== 0 ?
                          (
                              /* Pass in deleteTask function as Prop, to Tasks.js
                                 - Tasks.js contains Task.js
                                 - Task.js contains the button itself, that is the trigger point for deletion
                                 Pass in addTask function as Prop, to AddTask.js
                               */
                              <Tasks
                                  tasks={tasks}         /* Passing in tasks as Prop */
                                  onDelete={deleteTask} /* Passing in deleteTask (FUNCTION) as Prop, into variable onDelete */
                              />
                          )
                          :
                          'No Tasks Today!'
                  }

              </div>
          }
          </>
  );
}

export default App;
