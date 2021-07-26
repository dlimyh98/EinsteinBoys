// Each input will have it's own COMPONENT level state, not APP level state
import {useState} from 'react'
import moment from 'moment'
import format from "date-fns/format"
import add from 'date-fns/add'
import 'animate.css'

// AddText function catches onAdd Prop, that was passed in by App.js
// AddText has it's own onSubmitFunction, that triggers when onSubmit EVENT triggers.
// State Variables here MUST share the same name as State Variables in App.js
const AddText = function( {onAdd, tasks} )
{
    const [text, setText] = useState('')
    const [localDay, setlocalDay] = useState('')
    const [reminder, setReminder] = useState(false)
    const [priority, setPriority] = useState(4)
    const [eventColor, seteventColor] = useState('#A9A9A9')
    const [EventEndTime, setEventEndTime] = useState('')
    const [xDay, setxDay] = useState('')                         // difference between repeat blocks
    const [xTimes, setxTimes] = useState('')                     // how many times to repeat
    const [additionalRemarks, setadditionalRemarks] = useState('')
    const [animation, setAnimation] = useState(false)

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
        // eslint-disable-next-line no-mixed-operators
        return (xDay % 1 === 0 && xTimes % 1 === 0 && 0 < xDay <= 28 && 0 < xTimes <= 4)
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
            targetNumber > 0 && targetNumber % 1 === 0  ?
                isxDay ? targetNumber > 28 ? document.getElementById(event.target.id).style.color = 'red' : document.getElementById(event.target.id).style.color = 'black'
                    : targetNumber > 4 ? document.getElementById(event.target.id).style.color = 'red' : document.getElementById(event.target.id).style.color = 'black'
                : document.getElementById(event.target.id).style.color = 'red'
        }
    }

    function cleanData (text, localDay, EventEndTime) {
        let startTime = moment(localDay, "D MMMM YYYY h:mma", true)
        let endTime = moment(EventEndTime,"D MMMM YYYY h:mma", true)

        if (priority <= 3 && text && moment(startTime).isValid()
            && ( (priority === 0 && moment(endTime).isValid() && moment(startTime).isSame(endTime, 'day') && checkOrder(startTime,endTime)) || (priority !== 0) )
            && !checkDuplicate(text,startTime.toString())
            && validateNumber(xDay,xTimes)
        ) return true

        else return false
    }

    // Logic when User clicks 'Submit'
    const onSubmitFunction = function(e)    // Input is the Event currently happening (which will be the event that triggers onSubmit)
    {
        e.preventDefault()  // Prevents submission to a new webpage

        if (!cleanData(text,localDay,EventEndTime))
            alert("Please check your Inputs again")

        else
        {
            let loopTracker = -1

            do {
                let isoDay = moment((moment(localDay, "D MMMM YYYY h:mma", true)).add(xDay * loopTracker, 'days')).toISOString(true)                  // ISOString, prevent UTC conversion
                let day = moment((moment(localDay, "D MMMM YYYY h:mma", true)).add(xDay * loopTracker, 'days')).toString()                                       // JSDateString, Date Object
                let isoEventEndTime = moment((moment(EventEndTime, "D MMMM YYYY h:mma", true)).add(xDay * loopTracker, 'days')).toISOString(true)     // ISOString, prevent UTC conversion
                onAdd({text, day, isoDay, reminder, priority, eventColor, isoEventEndTime, additionalRemarks})
                loopTracker++
            } while (loopTracker < xTimes)

            // Clear the form from whatever the User typed in just now
            setText('')
            setlocalDay('')
            setReminder(false)
            setPriority(4)
            seteventColor('#A9A9A9')
            setEventEndTime('')
            setxDay('')
            setxTimes('')
            setadditionalRemarks('')
        }
    }

    const handleOptionChange = (changeEvent) => {
        setPriority(Number(changeEvent.target.value))    // Cast to Number, target.value is in String

        // Events will not have their color determined here, must wait for color-picker
        if (changeEvent.target.value !== 0) {
            switch (changeEvent.target.value) {
                case '1' : {seteventColor('#00FF00'); break}
                case '2' : {seteventColor ('#FFFF00'); break}
                case '3' : {seteventColor('#FF0000'); break}
                default : {seteventColor ("#A9A9A9")}
            }
        }
    }

    const handleColorChange = (changeEvent) => {
        seteventColor(changeEvent.target.value)
    }

    const animate = () => {
        setAnimation(true)
        setTimeout( () => setAnimation(false), 3000)
    }

    return(
        <form className = 'add-form' onSubmit = {onSubmitFunction} autoComplete = "off">
            <div className= 'priorityRadio'>
                <h3> Task or Event? </h3>
                <label style = {{marginRight : '15px'}}>
                    <input
                        type = 'radio'
                        value = '3'
                        checked = {priority === 3}
                        onChange = {handleOptionChange}
                        style = {{marginRight : '2px'}}
                    />
                    High Task
                </label>

                <label style = {{marginRight : '15px'}}>
                    <input
                        type = 'radio'
                        value = '2'
                        checked = {priority === 2}
                        onChange = {handleOptionChange}
                        style = {{marginRight : '2px'}}
                    />
                    Medium Task
                </label>

                <label style = {{marginRight : '15px'}}>
                    <input
                        type = 'radio'
                        value = '1'
                        checked = {priority === 1}
                        onChange = {handleOptionChange}
                        style = {{marginRight : '2px'}}
                    />
                    Low Task
                </label>

                <label style = {{marginRight : '3px'}}>
                    <input
                        type = 'radio'
                        value = '0'
                        checked = {priority === 0}
                        onChange = {handleOptionChange}
                        style = {{marginRight : '2px'}}
                    />
                    Event
                </label>

                    <input
                        type = "color"
                        value = {priority === 0 ? eventColor : "#A9A9A9"}
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
                       placeholder = {format(new Date(), 'd MMMM y hh:mmaaa')}
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
                       placeholder = {format(add(new Date(), {hours : 1}), 'd MMMM y hh:mmaaa')}
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
                <h3> Repeat? (Optional) </h3>

                <label>
                    Repeat every <input
                    style={{width: "125px", marginRight : '3px'}}
                    type='number'
                    id='xDay'
                    placeholder=' enter a number...'
                    value={xDay}
                    onChange={(e) => setxDay(e.target.value)}
                    onKeyUp={(e) => checkRepeatInput(e, true, xDay)} />
                </label>

                <label>
                    days, <input
                    style={{width: "127px"}}
                    type='number'
                    id='xTimes'
                    placeholder=' how many times?'
                    value={xTimes}
                    onChange={(e) => setxTimes(e.target.value)}
                    onKeyUp={(e) => checkRepeatInput(e, false, xTimes)}
                />
                </label>
            </div>
            <br/>

            <div>
                <h3> Additional Remarks? (Optional) </h3>
                <label>
                    <input
                        style = {{width : "300px"}}
                        type = 'text'
                        id = 'additionalRemarks'
                        placeholder = '  Enter your remarks here...'
                        value = {additionalRemarks}
                        onChange = { (e) => setadditionalRemarks(e.target.value) }
                    />
                </label>
            </div>
            <br/>

            <input
                type = 'submit'
                value = 'Save'
                className = {animation ? 'btn btn-block saveButtonAnimation' : 'btn btn-block'}
                onClick = {animate}
            />

        </form>
    )
}

export default AddText