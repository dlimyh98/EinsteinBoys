import Header from './components/Header'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import {useEffect, useState} from 'react' // Deals with side-effects, Component needs to do something AFTER rendering
import Authentication from './components/Authentication'
import Axios from "axios"

// App (Global) State.
// Not best practice, will use Redux to keep track of JS States in future
// Components can be Functions (with hooks) or Classes
function App() {

    const fetchTasks = () => {
        //console.log("Fetching")
        Axios({
            method : "GET",
            withCredentials : true,
            url : 'http://localhost:4000/tasks'
        }).then( (res) => {
            //console.log("Setting")
            setTasks(res.data.task)
        })
    }

    const [tasks, setTasks] = useState( () => () => fetchTasks())    // useState function, unlike useState value
    const [showAddButton, setshowAddButton] = useState(false)
    const [isAuth, setisAuth] = useState(false)

    useEffect(() => {
        console.log("useEffect triggered")
        console.log("Auth is " , isAuth)
            fetchTasks()
        }, [isAuth]
    )

    const onAdd = (TaskAdded) => {
        Axios({
            method : "POST",
            data : TaskAdded,
            withCredentials : true,
            url: "http://localhost:4000/tasks",
        }).then((res) => {
            fetchTasks()
        })
    }

    const deleteTask = async(TaskDelete) => {
        Axios({
            method : "DELETE",
            data : TaskDelete,
            withCredentials : true,
            url : "http://localhost:4000/tasks",
        }).then((res) => {
            //console.log(res.data.task)
            fetchTasks()
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
                                  tasks={tasks}         /* Passing in tasks Array as Prop */
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
