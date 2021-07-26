import Tasks from "./Tasks";

const TaskView = ({tasks, isPriority, setisPriority, isTime, setisTime, isManual, setisManual,
                  textFilter, settextFilter, datetimeFilter, setdatetimeFilter, viewingOptions, setviewingOptions, deleteTask, updateTask}) => {

    return (
        <div className = 'TaskView CalendarTaskView-Container-TaskView'>
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
                    defaultValue = {viewingOptions}
            >
                <option value='0'> Tasks</option>
                <option value='1'> Events</option>
                <option value='2'> Tasks & Events</option>
            </select>
        </div>

            <Tasks
                tasks={tasks}
                onDelete={deleteTask}
                toggleManual={isManual}
                onUpdate={updateTask}
                textFilter={textFilter}
                datetimeFilter={datetimeFilter}
                viewingOptions={viewingOptions}
            />

        </div>

    )
}

export default TaskView