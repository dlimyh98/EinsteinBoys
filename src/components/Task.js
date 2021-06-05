import {FaTimes} from 'react-icons/fa'  // Importing Icons from installed React Icons Library. Restart npm server after installing!


/* Events are stored in App.js, so how to modify the component when we click on it?
- We could access the State within our components, if we were using Redux/Context
- Alternatively, we could use Props. Send down a function as a Prop, then fire that function off here in Task.js
  State gets passed down, Actions get passed up
 */

function priorityColor (parameter) {
    switch(parameter) {
        case 1 : return "SpringGreen"
        case 2 : return "Khaki"
        case 3 : return "IndianRed"
        default : return "GainsBoro"
    }
}

// wrt INDIVIVUAL Task (we have mapped in Tasks.js)
const Task = function({task, onDelete})
{
    return(
        <div style = { {backgroundColor : priorityColor(Number(task.priority)) } }
            /* first className is task */
            /* second classname is using template literals (backticks) */
            className = { `task ${ task.reminder ? 'reminder' : ' '}`}
        >
            <h3>
                {task.text}
                <FaTimes
                    style = {{ color : 'Black', cursor : 'pointer'}}   /* Use double braces for Style */
                    onClick = { () => onDelete( task ) }             /* Pass in the task.text as well! */
                    /* onClick will cause onDelete to work it's way up to App.js, where it will call deleteTask */
                />
            </h3>
            <p> {(task.day.slice(0, -12))} </p>
        </div>
    )
}

export default Task