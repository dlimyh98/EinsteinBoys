import Task from './Task'
import moment from 'moment'

const Tasks = function ({tasks, onDelete, togglePriority}) {

    // Passing in State Variable as prop, and we are mutating it here.
    // Hence changes here WILL reflect upwards to parent (App.js)
   if (togglePriority) {
        tasks.sort((a, b) => {
            if (a.priority > b.priority) return -1
            else { return 0 }
        })
    }

    else {
           tasks.sort((a,b) => {
            if ( (moment(a.isoDay).unix()) < (moment(b.isoDay).unix()) ) return -1
            else {return 0}
        })
    }

    return (
        <>
            {
                tasks.map(                       // For each index in tasks Object Array, run the function defined below on each index
                    (task, index) => (      // task is the 'val' argument for .map function. If only one value in argument, it will be val
                        // Function returns a user-defined Task Component
                        <Task
                            key={index}         /* Store each task.id into key variable */
                            task={task}         /* Pass in task as Prop into Task.js, using variable task */
                            onDelete={onDelete} /* Pass in onDelete as Prop into Task.js, using variable onDelete*/
                        />
                    )
                )
            }
        </>
    )
}

export default Tasks
