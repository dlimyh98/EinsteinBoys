// Each input will have it's own COMPONENT level state, not APP level state
import {useState} from 'react'
import moment from 'moment'

// AddText function catches onAdd Prop, that was passed in by App.js
// AddText has it's own onSubmitFunction, that triggers when onSubmit EVENT triggers.
// State Variables here MUST share the same name as State Variables in App.js
const AddText = function( {onAdd} )
{
    const[text, setText] = useState('')
    let [day, setDay] = useState('')
    const[reminder, setReminder] = useState(false)
    const[priority, setPriority] = useState(0)


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
            let isoDay = (moment(day, "DD-MMMM-YYYY hh:mm a A")).toISOString(true)  // ISOString, prevent UTC conversion
            day = (moment(day, "DD-MMMM-YYYY hh:mm a A")).toString()                           // JSDateString, Date Object

            // Inputs would have already been captured in Stateful Value (as the User was typing it in), hence just capture that
            onAdd({text, day, isoDay, reminder, priority})

            // Clear the form from whatever the User typed in just now
            setText('')
            setDay('')
            setReminder(false)
            setPriority(0)
        }
    }

    const handleOptionChange = async (changeEvent) => {
        setPriority(Number(changeEvent.target.value))    // Cast to Number, target.value is in String
    }

    return(
        <form className = 'add-form' onSubmit = {onSubmitFunction}>

            <div className = 'form-control'>
                <label> Task </label>
                <input type = 'text'
                       placeholder = 'What needs to be done?'
                       value = {text}
                       onChange = { (e) => setText(e.target.value) }
                />
            </div>

            <div className = 'form-control'>
                <label> Date and Time (Strictly follow format below!) </label>
                <input type='text'
                       placeholder = '1 June 2021 7:00 am'
                       value = {day}
                       onChange = { (e) => setDay(e.target.value) }
                />
            </div>

            <div className = 'form-control form-control-check'>  {/* Input multiple classes by using Quotations, can use String Template also */}
                <label> Reminders? </label>
                <input type='checkbox'
                       name='Reminders'
                       value = {reminder}
                       checked = {reminder} // Iff reminder is true, then box will be checked
                       onChange = { (e) => setReminder(e.currentTarget.checked) }
                />
            </div>

            <div className= 'priorityRadio'>
                <h3> Priority </h3>
                <label>
                    <input
                        type = 'radio'
                        value = '3'
                        checked = {priority === 3}
                        onChange = {handleOptionChange}
                    />
                    High Priority Task
                </label>
                <label>
                    <input
                        type = 'radio'
                        value = '2'
                        checked = {priority === 2}
                        onChange = {handleOptionChange}
                    />
                    Medium Priority Task
                </label>
                <label>
                    <input
                        type = 'radio'
                        value = '1'
                        checked = {priority === 1}
                        onChange = {handleOptionChange}
                    />
                    Low Priority Task
                </label>
                <label>
                    <input
                        type = 'radio'
                        value = '0'
                        checked = {priority === 0}
                        onChange = {handleOptionChange}
                    />
                    Event
                </label>
            </div>

            <input type = 'submit' value = 'Save Task' className = 'btn btn-block' />
        </form>
    )
}

export default AddText