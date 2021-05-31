import Task from './Task'

// Destructuring tasks passed in from App.js
// Destructuring onDelete passed in from App.js
const Tasks = function( {tasks, onDelete} )
{
    return(
        <>
            {
                tasks.map(                  /* For each index in tasks Object Array, run the function defined below on each index*/
                    (task, index) => (      /* task is the 'val' argument for .map function. If only one value in argument, it will be val */
                        /* Function returns a user-defined Task Component */
                        <Task
                            key = {index}         /* Store each task.id into key variable */
                            task = {task}         /* Pass in task as Prop into Task.js, using variable task */
                            onDelete = {onDelete} /* Pass in onDelete as Prop into Task.js, using variable onDelete*/
                        />
                    )
                )
            }
        </>
    )
}

export default Tasks
