import './components/Body.css'
import Header from './components/Header'
import TaskView from './components/TaskView'
import AddTask from './components/AddTask'
import LoadingScreen from './components/LoadingScreen'
import {useEffect, useState} from 'react' // Deals with side-effects, Component needs to do something AFTER rendering
import Axios from "axios"
import Calendar from './components/Calendar'
import moment from 'moment'
import Authentication from './components/Authentication'


// App (Global) State
// Not best practice, will use Redux to keep track of JS States in future
// Components can be Functions (with hooks) or Classes
function App() {

    const fetchTasks = () => {
        Axios({
            method : "GET",
            withCredentials : true,
            url : 'http://localhost:4000/tasks'
        }).then((res) => {
            setTasks(res.data.task)
            setisLoading(false)
        })
    }

    const [isLoading, setisLoading] = useState(true)
    const [tasks, setTasks] = useState(() => fetchTasks)    // useState function, unlike useState value
    const [showAddButton, setshowAddButton] = useState(false)
    const [isAuth, setisAuth] = useState(false)
    const [isPriority, setisPriority] = useState(false)
    const [isTime, setisTime] = useState(false)
    const [isManual, setisManual] = useState(false)
    const [textFilter, settextFilter] = useState('')
    const [datetimeFilter, setdatetimeFilter] = useState('')
    const [viewingOptions, setviewingOptions] = useState(2)

    useEffect(() => {
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

    const deleteTask = (TaskDelete) => {
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

    const updateTask = (newTaskOrdering) => {
        Axios({
            method : "PUT",
            data : newTaskOrdering,
            withCredentials : true,
            url : "http://localhost:4000/tasks",
        }).then((res) => {
            fetchTasks()
        })
    }

    useEffect(() => {
            if (tasks.length > 0 && isPriority === true) {
                const sortedTasks = [...tasks].sort((a, b) => {
                    if (a.priority > b.priority) return -1    // A Priority > B Priority, leave in same order (Top-Down rendering)
                    else { return 0 }
                })
                setTasks(sortedTasks)
                setisTime(false)
                setisManual(false)
            }
        }, [isPriority]
    )

    useEffect(() => {
            if (tasks.length > 0 && isTime === true) {
                const sortedTasks = [...tasks].sort((a, b) => {
                    if ((moment(a.isoDay).unix()) < (moment(b.isoDay).unix())) return -1  // A earlier than B, leave in same order (Top-Down rendering)
                    else { return 0 }
                })
                setTasks(sortedTasks)
                setisPriority(false)
                setisManual(false)
            }
        }, [isTime]
    )

    useEffect( () => {
        if (isManual === true) {
            fetchTasks()
            setisPriority(false)
            setisTime(false)
        }
        }, [isManual]
    )

    // Return is JSX, not HTML
    // Can only return one single Parent Element
    return (
        <>
            {!isAuth && <Authentication setisAuth={setisAuth}/>}

            {isAuth && isLoading
                ? <LoadingScreen/>
                : <>
                    {isAuth &&
                    <div className='container'>
                        <Header
                            buttonColorDecider={showAddButton}
                            toggleAdd={() => setshowAddButton(!showAddButton)}
                        />
                        {showAddButton ? <AddTask onAdd={onAdd} tasks={tasks}/> : ''}
                    </div>
                    }

                    {isAuth && <div className='CalendarTaskView-Container'>
                        <Calendar
                            tasks={tasks}
                            isPriority={isPriority}
                            isTime={isTime}
                            textFilter={textFilter}
                            datetimeFilter={datetimeFilter}
                            viewingOptions={viewingOptions}/>

                        <TaskView
                            tasks={tasks}
                            isPriority={isPriority}
                            setisPriority={setisPriority}
                            isTime={isTime}
                            setisTime={setisTime}
                            isManual={isManual}
                            setisManual={setisManual}
                            textFilter={textFilter}
                            settextFilter={settextFilter}
                            datetimeFilter={datetimeFilter}
                            setdatetimeFilter={setdatetimeFilter}
                            viewingOptions={viewingOptions}
                            setviewingOptions={setviewingOptions}
                            deleteTask={deleteTask}
                            updateTask={updateTask}/>
                    </div>
                    }
                </>
            }

        </>
    );
}

export default App;
