import Header from './components/Header'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import LoadingScreen from './components/LoadingScreen'
import {useEffect, useState} from 'react' // Deals with side-effects, Component needs to do something AFTER rendering
import Authentication from './components/Authentication'
import Axios from "axios"
import Calendar from './components/Calendar'
import moment from 'moment'

// App (Global) State.
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
                :
                <>
                    {isAuth && <Calendar
                        tasks={tasks}
                        isPriority={isPriority}
                        isTime={isTime}
                        textFilter={textFilter}
                        datetimeFilter={datetimeFilter}
                        viewingOptions = {viewingOptions}
                    />}

                    {isAuth &&
                    <div className='container'>

                        <Header
                            buttonColorDecider={showAddButton}
                            toggleAdd={() => setshowAddButton(!showAddButton)}
                        /> {/* Button is in <Header>, so we must pass down the State Hook function as a Prop. We also define the State Hook function here */}

                        {showAddButton
                            ? <AddTask onAdd={onAdd} tasks={tasks}/>
                            : ''
                        } {/* Event Handlers must be function or function reference, for setshowAddButton*/}

                        <div>
                            <label> togglePriority </label>
                            <input
                                type='radio'
                                name='toggleOptions'
                                value={isPriority}
                                checked={isPriority}
                                onChange={(e) => setisPriority(e.currentTarget.checked)}
                            />

                            <label> toggleTime </label>
                            <input
                                type='radio'
                                name='toggleOptions'
                                value={isTime}
                                checked={isTime}
                                onChange={(e) => setisTime(e.currentTarget.checked)}
                            />

                            <label> toggleManual </label>
                            <input
                                type='radio'
                                name='toggleOptions'
                                value={isManual}
                                checked={isManual}
                                onChange={(e) => setisManual(e.currentTarget.checked)}
                            />
                        </div>

                        <div>
                            <label> Detail Search </label>
                            <input
                                type='text'
                                value={textFilter}
                                onChange={(e) => settextFilter(e.target.value)}
                            />
                        </div>

                        <div>
                            <label> Date Search </label>
                            <input
                                type='date'
                                value={datetimeFilter}
                                onChange={(e) => setdatetimeFilter(e.target.value)}
                            />
                            <button onClick={() => setdatetimeFilter('')}> Clear</button>
                        </div>

                        <div>
                            <label> Viewing Options </label>
                            <select id='viewingOptions'
                                    onChange={(e) => setviewingOptions(document.getElementById('viewingOptions').value)}
                                    defaultValue={'2'}
                            >
                                <option value = '0'> Tasks </option>
                                <option value = '1'> Events </option>
                                <option value = '2'> Tasks & Events </option>
                            </select>

                        </div>

                        <div>
                            {
                                tasks.length !== 0 ?
                                    (
                                        <Tasks
                                            tasks={tasks}
                                            onDelete={deleteTask}
                                            toggleManual={isManual}
                                            onUpdate={updateTask}
                                            textFilter={textFilter}
                                            datetimeFilter={datetimeFilter}
                                            viewingOptions = {viewingOptions}
                                        />
                                    )
                                    :
                                    'No Tasks Today!'
                            }
                        </div>
                    </div>
                    }
                </>
            }
        </>
    );
}

export default App;
