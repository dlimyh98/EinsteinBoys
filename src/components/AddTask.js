// Each input will have it's own COMPONENT level state, not APP level state
import {useState} from 'react'

// AddText function catches onAdd Prop, that was passed in by App.js
// AddText has it's own onSubmitFunction, that triggers when onSubmit EVENT triggers.
// State Variables here MUST share the same name as State Variables in App.js
const AddText = function( {onAdd} )
{
    const[text, setText] = useState('')
    const[day, setDay] = useState('')
    const[reminder, setReminder] = useState(false)


    // Logic when User clicks 'Submit'
    const onSubmitFunction = function(e)    // Input is the Event currently happening (which will be the event that triggers onSubmit)
    {
        e.preventDefault()  // Prevents submission to a new webpage

        // Pop-up if User did not enter Text, and clicked submit
        if (!text)
        {
            alert('Enter a Task!')
        }
        else   // If everything ok, capture the data
        {
            // Call the onAdd function, passing in the appropriate inputs
            // Inputs would have already been captured in Stateful Value (as the User was typing it in), hence just capture that
            onAdd( {text,day,reminder} )

            // Clear the form from whatever the User typed in just now
            // Define (reuse) the State Hook functions, to modify the Stateful Value
            setText('')
            setDay('')
            setReminder(false)
        }
    }

    return(
        <form className = 'add-form' onSubmit = {onSubmitFunction}>

            <div className = 'form-control'>
                <label> Task </label>
                <input type = 'text'
                       placeholder = 'Add Task'
                       value = {text}
                       onChange = { (e) => setText(e.target.value) }
                />
            </div>

            <div className = 'form-control'>
                <label> Date and Time </label>
                <input type='text'
                       placeholder = 'Enter Date and Time'
                       value = {day}
                       onChange = { (e) => setDay(e.target.value) }
                />
            </div>

            <div className = 'form-control form-control-check'>  {/* Input multiple classes by using Quotations, can use String Template also */}
                <label> Reminders </label>
                <input type='checkbox'
                       name='Reminders'
                       value = {reminder}
                       checked = {reminder} // Iff reminder is true, then box will be checked
                       onChange = { (e) => setReminder(e.currentTarget.checked) }
                />
            </div>

            <input type = 'submit' value = 'Save Task' className = 'btn btn-block' />
        </form>
    )
}

export default AddText