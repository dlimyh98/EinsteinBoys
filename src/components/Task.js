import {FaTimes} from 'react-icons/fa'  // Importing Icons from installed React Icons Library. Restart npm server after installing!

// Destructuring task, that was passed in as Prop from Tasks.js
// Destructuring onDelete, that was passed in as Prop from Tasks.js

/* Events are stored in App.js, so how to modify the component when we click on it?
- We could access the State within our components, if we were using Redux/Context
- Alternatively, we could use Props. Send down a function as a Prop, then fire that function off here in Task.js
  State gets passed down, Actions get passed up
 */

const Task = function({task, onDelete, toggleReminder})
{
    return(
        <div
            /* first className is task */
            /* second classname is using template literals (backticks) */
            className = { `task ${ task.reminder ? 'reminder' : ' '}`}
            onDoubleClick = { () => toggleReminder((task.id)) }    /* onDoubleClick on div, not header (Button) */
        >
            <h3>
                {task.text}
                <FaTimes
                    style = {{ color : 'red', cursor : 'pointer'}}   /* Use double braces for Style */
                    onClick = { () => onDelete(task.id) }             /* Pass in the task.id as well! */
                    /* onClick will cause onDelete to work it's way up to App.js, where it will call deleteTask */
                />
            </h3>
            <p> {task.day} </p>
        </div>
    )
}

export default Task