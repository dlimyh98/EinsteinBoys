// Each input will have it's own COMPONENT level state, not APP level state
import {useState} from 'react'
import moment from 'moment'

// AddText function catches onAdd Prop, that was passed in by App.js
// AddText has it's own onSubmitFunction, that triggers when onSubmit EVENT triggers.
// State Variables here MUST share the same name as State Variables in App.js
const AddText = function( {onAdd, tasks} )
{
    const [text, setText] = useState('')
    const [localDay, setlocalDay] = useState('')
    const [reminder, setReminder] = useState(false)
    const [priority, setPriority] = useState(3)
    const [eventColor, seteventColor] = useState('#A9A9A9')
    const [EventEndTime, setEventEndTime] = useState('')
    const [xDay, setxDay] = useState('')                         // difference between repeat blocks
    const [xTimes, setxTimes] = useState('')                     // how many times to repeat

    // duplicate = similarText and startTime
    function checkDuplicate (text, startTimeString) {
        if (tasks) {
            for (let i = 0; i < tasks.length; i++) {
                if (tasks[i].text === text && tasks[i].day === startTimeString)
                    return true
            }
            return false
        }
    }

    function checkOrder (startTime, endTime) {
        return(moment(endTime).isAfter(startTime,'minute'))
    }

    function validateNumber(xDay,xTimes) {
        return (!isNaN(xDay) && !isNaN(xTimes) && xDay <= 28 && xTimes <= 4)
    }

    function cleanData (text, localDay, EventEndTime) {
        let startTime = moment(localDay, "D MMMM YYYY h:mma", true)
        let endTime = moment(EventEndTime,"D MMMM YYYY h:mma", true)

        if (text && moment(startTime).isValid()
            && ( (priority === 0 && moment(endTime).isValid() && moment(startTime).isSame(endTime, 'day') && checkOrder(startTime,endTime)) || (priority !== 0) )
            && !checkDuplicate(text,startTime.toString())
            && validateNumber(xDay,xTimes)
        ) return true

        else return false
    }

    function checkTimeInput(event, targetString) {
        if (event) {
            !moment(targetString, "D MMMM YYYY h:mma", true).isValid()
                ? document.getElementById(event.target.id).style.color = 'red'
                : document.getElementById(event.target.id).style.color = 'black'
        }
    }


    function checkRepeatInput(event, isxDay, targetNumber) {
        if (event) {
            !isNaN(targetNumber) ?
                isxDay ? targetNumber > 28 ? document.getElementById(event.target.id).style.color = 'red' : document.getElementById(event.target.id).style.color = 'black'
                    : targetNumber > 4 ? document.getElementById(event.target.id).style.color = 'red' : document.getElementById(event.target.id).style.color = 'black'
                : document.getElementById(event.target.id).style.color = 'red'
        }
    }


    // Logic when User clicks 'Submit'
    const onSubmitFunction = function(e)    // Input is the Event currently happening (which will be the event that triggers onSubmit)
    {
        e.preventDefault()  // Prevents submission to a new webpage

        if (!cleanData(text,localDay,EventEndTime))
            alert("Please check your Inputs again")

        else
        {
            let loopTracker = 0

            do {
                let isoDay = moment((moment(localDay, "D MMMM YYYY h:mma", true)).add(xDay * loopTracker, 'days')).toISOString(true)                  // ISOString, prevent UTC conversion
                let day = moment((moment(localDay, "D MMMM YYYY h:mma", true)).add(xDay * loopTracker, 'days')).toString()                                       // JSDateString, Date Object
                let isoEventEndTime = moment((moment(EventEndTime, "D MMMM YYYY h:mma", true)).add(xDay * loopTracker, 'days')).toISOString(true)     // ISOString, prevent UTC conversion
                onAdd({text, day, isoDay, reminder, priority, eventColor, isoEventEndTime})
                loopTracker++
            } while (loopTracker < xTimes)


            // Clear the form from whatever the User typed in just now
            setText('')
            setlocalDay('')
            setReminder(false)
            setPriority(3)
            seteventColor('#A9A9A9')
            setEventEndTime('')
            setxDay('')
            setxTimes('')
        }
    }

    const handleOptionChange = (changeEvent) => {
        setPriority(Number(changeEvent.target.value))    // Cast to Number, target.value is in String
    }

    const handleColorChange = (changeEvent) => {
        seteventColor(changeEvent.target.value)
    }

    return(
        <form className = 'add-form' onSubmit = {onSubmitFunction} autoComplete = "off">

            <div className= 'priorityRadio'>
                <h3> Task or Event? </h3>
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

                    <input
                        type = "color"
                        value = {eventColor}
                        onChange = {handleColorChange}
                    />
            </div>

            <div className = 'form-control'>
                <label> {priority === 0 ? 'Event Details' : 'Task Details'} </label>
                <input type = 'text'
                       id = 'TaskEventText'
                       placeholder = 'What needs to be done?'
                       value = {text}
                       onChange = { (e) => setText(e.target.value) }
                />
            </div>

            <div className = 'form-control'>
                <label> {priority === 0 ? 'Event Start' : 'Task Deadline'} </label>
                <input type='text'
                       id = 'DateAndTimeStart'
                       placeholder = '1 June 2021 7:00am'
                       value = {localDay}
                       onChange = { (e) => setlocalDay(e.target.value) }
                       onKeyUp = { (e) => checkTimeInput(e, localDay)}
                />
            </div>

            {priority === 0 &&
            <div className = 'form-control'>
                <label> Event End </label>
                <input type = 'text'
                       id = 'DateAndTimeEnd'
                       placeholder = '1 June 2021 7:30am'
                       value = {EventEndTime}
                       onChange = { (e) => setEventEndTime(e.target.value)}
                       onKeyUp = { (e) => checkTimeInput(e, EventEndTime)}
                />
            </div>
            }

            <div className = 'form-control form-control-check'>  {/* Input multiple classes by using Quotations, can use String Template also */}
                <label> Reminders? </label>
                <input type='checkbox'
                       name='Reminders'
                       value = {reminder}
                       checked = {reminder} // Iff reminder is true, then box will be checked
                       onChange = { (e) => setReminder(e.currentTarget.checked) }
                />
            </div>

            <div>
                <h3> Repeat? </h3>
                <label>
                    Repeat every
                    <input
                        type = 'text'
                        id = 'xDay'
                        placeholder = 'enter a number...'
                        value = {xDay}
                        onChange = { (e) => setxDay(e.target.value) }
                        onKeyUp = { (e) => checkRepeatInput(e,true,xDay) }
                    />
                </label>

                <label>
                    days,
                    <input
                        type = 'text'
                        id = 'xTimes'
                        placeholder = 'How many times?'
                        value = {xTimes}
                        onChange = { (e) => setxTimes(e.target.value) }
                        onKeyUp = { (e) => checkRepeatInput(e,false,xTimes) }
                    />
                </label>
            </div>

            <input type = 'submit' value = 'Save' className = 'btn btn-block' />
        </form>
    )
}

export default AddText