import {FaTimes} from 'react-icons/fa'
import formatISO9075 from "date-fns/formatISO9075";
import parseISO from "date-fns/parseISO";
import {useState} from "react";  // Importing Icons from installed React Icons Library. Restart npm server after installing!
/* Events are stored in App.js, so how to modify the component when we click on it?
- We could access the State within our components, if we were using Redux/Context
- Alternatively, we could use Props. Send down a function as a Prop, then fire that function off here in Task.js
  State gets passed down, Actions get passed up
 */


// Decides the BACKGROUND COLOR of the Tasks
function priorityColor(task) {
    if (task) {
        if (Number(task.priority !== 0)) {
            switch (task.priority) {
                case 1 : return "SpringGreen"
                case 2 : return "Khaki"
                case 3 : return "IndianRed"
                default : return "Black" // Shouldn't happen
            }
        } else return String(task.eventColor)
    }
}

// wrt INDIVIVUAL Task (we have mapped in Tasks.js)
const Task = function({task, onDelete, dragStart, dragDrop, onDropFunc})
{
    const [animation, setAnimation] = useState(false)

    const animate = () => {
        setAnimation(true)
        setTimeout( () => setAnimation(false), 3000)
    }

    return(
        <div style = {{backgroundColor: priorityColor(task)}}
             className = {` task ${task.reminder ? 'reminder' : ' '} `}
             draggable = 'true'

             // capture information from Source
             onDragStart = { (e) => {
                 dragStart(e)
             }}

             // capture information when hovering, ONLY captures Source
             // is here just to enable onDrop
             onDragOver = { (e) => {
                 e.stopPropagation()
                 e.preventDefault()
             }}

             // Capture information on Drop
             onDrop = { (e) => {
                 e.stopPropagation()
                 e.preventDefault()
                 dragDrop(e)
             }}

             // fires AFTER onDrop
             onDragEnd = { () => {
                 onDropFunc()
             }}

        >
            <h3>
                {task.text}
                <FaTimes
                    className = {animation ? 'deleteButton' : ''}
                    style = {{ color : 'Black', cursor : 'pointer'}}   /* Use double braces for Style */
                    onClick = { () => {onDelete(task); animate() }}             /* Pass in the task.text as well! */
                    /* onClick will cause onDelete to work it's way up to App.js, where it will call deleteTask */
                />
            </h3>

            <p>
                {task.priority === 0
                    ? task.day.slice(0,-12) + " - " + formatISO9075(parseISO(task.isoEventEndTime), {representation: 'time'}).slice(0, -3)
                    : task.day.slice(0, -12)}
            </p>


            {/* tooltiptextNoDisplay is not defined in index.css, this is so that the hover wont work on it */}
            <p className = {task.additionalRemarks === '' ? 'tooltiptextNoDisplay' : "tooltiptext"}>
                {task.additionalRemarks}
            </p>

        </div>
    )
}

export default Task