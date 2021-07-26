import React, {useEffect, useState} from "react";
import DayPopup from './DayPopup'
import "./Calendar.css";
import format from "date-fns/format"
import startOfWeek from 'date-fns/startOfWeek'
import endOfWeek from 'date-fns/endOfWeek'
import startOfMonth from 'date-fns/startOfMonth'
import endOfMonth from 'date-fns/endOfMonth'
import isSameMonth from 'date-fns/isSameMonth'
import isSameDay from 'date-fns/isSameDay'
import addDays from 'date-fns/addDays'
import addMonths from 'date-fns/addMonths'
import subMonths from "date-fns/subMonths"
import toDate from 'date-fns/toDate'
import parseISO from 'date-fns/parseISO'            // parse ISO to Date
import formatISO9075 from 'date-fns/formatISO9075'

const Calendar = ({tasks, isPriority, isTime, textFilter, datetimeFilter, viewingOptions}) => {

    const[passedTasks, setPassedTasks] = useState(tasks)
    const [isOpen, setisOpen] = useState(false)
    const [popupText, setpopupText] = useState([])

    useEffect(() => {
            if (tasks && tasks.length > 0)
                setPassedTasks([...tasks])

            else if (tasks.length >= 0)
                setPassedTasks([])
        }, [tasks, isPriority, isTime]
    )

    // Default State is current Day
    const [currentDate, setCurrentDate] = useState(new Date());     // for Calendar to render proper month
    const [selectedDate, setSelectedDate] = useState(new Date());   // styling for selected Date

    useEffect(() => {
        let tmp = []

        // Search through tasks Array for selectedDate
        for (let i = 0; i < tasks.length; i++) {
            if (isSameDay(parseISO(tasks[i].isoDay), selectedDate))
                tmp.push(tasks[i])
        }
        setpopupText(tmp)
        }, [selectedDate]
    )

    // Add 1 to current Month
    const nextMonth = () => { setCurrentDate(addMonths(currentDate, 1)); };

    // Deduct 1 from current Month
    const prevMonth = () => { setCurrentDate(subMonths(currentDate, 1)); };

    // sets how Header (Month/Year) is displayed
    const header = () => {
        const dateFormat = "MMMM yyyy";
        return (
            <div className="header row flex-middle centerDay">

                <div className="column col-start">
                    <div className="icon" onClick={prevMonth}>
                        chevron_left
                    </div>
                </div>

                <div className="column col-center">
                    <span>{format(currentDate, dateFormat)}</span>
                </div>

                <div className="column col-end">
                    <div className="icon" onClick={nextMonth}>
                        chevron_right
                    </div>
                </div>

            </div>
        );
    };

    // sets how (Monday-Sunday) is displayed just below Header
    const days = () => {
        const dateFormat = "E";
        const days = [];
        let startDate = startOfWeek(currentDate);   // use date-fns startOfWeek along with currentDate state

        // For each iteration, push a <div> into days Array
        for (let i = 1; i < 8; i++) {   // Mon-Sunday (1-8)
            days.push(
                <div className="column col-center centerDay" key={i}>
                    {format(addDays(startDate, i), dateFormat)}
                </div>
            );
        }
        return <div className="days row">{days}</div>;
    };

    const onDateClick = (day, e) => {
        setSelectedDate(day);
        setisOpen(true)
    }

    function handleviewingOptions (task) {
        switch(viewingOptions) {
            case '0' : return (task.priority !== 0)    // only view Tasks (viewingOptions === 0)
            case '1' : return (task.priority === 0)    // only view Events (viewingOptions === 1)
            default : return true                      // view both Tasks and Events
        }
    }

    // sets how EACH cell is populated
    const cells = (passedTasks) => {
        const monthStart = startOfMonth(currentDate);    // when does month start (Day)
        const monthEnd = endOfMonth(monthStart);         // when does month end (Day)
        const startDate = addDays(startOfWeek(monthStart),1);       //  when does THAT WEEK start for the month start DAY. Offset by 1 because Mon-Sun
        const endDate = endOfWeek(monthEnd);             // final date of the CURRENT month, use as a check against
        const dateFormat = "d";                          // render correct date in each cell
        const rows = [];                                 // render all weeks of given month
        let days = [];                                   // render each day in the week
        let day = startDate;                             // points to start date of CURRENT month
        let formattedDate = "";

        // Determines color of Tasks in storageArray (according to Priority)
        function TaskToCalendarColoring(passedTasks, traversal) {
            if (passedTasks) {    // prevent Memory Leak
                if (passedTasks[traversal].priority !== 0) {
                    switch (passedTasks[traversal].priority) {
                        case 3 : return "IndianRed"
                        case 2 : return "Khaki"
                        case 1 : return "SpringGreen"
                        default : return "Blue"   // Shouldn't happen
                    }
                }

                else {
                    return passedTasks[traversal].eventColor
                }
            }
        }

        let traversal = 0;  // Initializing to zero ONCE
        // Extract Tasks from database to Array
        function TaskToCalendar(passedTasks, traversal, day) {
            let tmp = [];
            while (passedTasks && passedTasks[traversal]) {
                if (isSameDay(parseISO(passedTasks[traversal].isoDay), day)) {
                    tmp.push(passedTasks[traversal].text.includes(textFilter)
                    && (isSameDay(parseISO(datetimeFilter), parseISO(passedTasks[traversal].isoDay)) || datetimeFilter === '')
                    && handleviewingOptions(passedTasks[traversal])
                        ?
                        <div
                            key={parseISO(passedTasks[traversal].isoDay) + passedTasks[traversal].text}
                        >
                            <span> {passedTasks[traversal].text} </span>
                            <span style={{color: TaskToCalendarColoring(passedTasks, traversal)}}>
                                {passedTasks[traversal].priority === 0 ?
                                    formatISO9075(parseISO(passedTasks[traversal].isoDay), {representation: 'time'}).slice(0, -3)
                                    + "-" + formatISO9075(parseISO(passedTasks[traversal].isoEventEndTime), {representation: 'time'}).slice(0, -3)
                                    : formatISO9075(parseISO(passedTasks[traversal].isoDay), {representation: 'time'}).slice(0, -3)}
                        </span>
                        </div>
                        : null)
                }
                traversal++
            }
            return {storageArray: tmp}
        }

        while (day <= endDate) {   // Guarantees that loop runs for entirety of month
            // For each iteration, push a single cell into days array
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, dateFormat);
                const cloneDay = day;

                // For each DAY, sweep through the tasks array ONCE ENTIRELY
                const {storageArray} = TaskToCalendar(passedTasks, traversal, day)

                traversal = 0   // RESET the modified traversal value

                days.push(
                    <div
                        className={`column cell ${!isSameMonth(day, monthStart) ? "disabled"      // Days not in current Month are greyed out
                            : isSameDay(day, selectedDate) ? "currentDate": ""}`}                 // currentDate and selectedDate overwrite
                        key={day}
                        onClick = {(e) => onDateClick(toDate(cloneDay), e)}   // sets currentDate hook to whatever cell is being clicked on
                    >
                        <span className="number"> {formattedDate} </span>
                        <span className="bg"> {formattedDate} </span>
                        {storageArray}
                    </div>
                );

                day = addDays(day, 1);     // Increment to next day
            }

            // Push the entire days array (as a single div) into rows array
            rows.push(
                <div className="row" key={day}> {days} </div>
            );

            // Clear the days array to start over for the next week (next 7 days)
            days = [];
        }
        // Once while loop is done, return the full rows array as single div
        return <div className="body">{rows}</div>;
    }

    const togglePopup = () => {
        setisOpen(!isOpen)
    }

    // Rendering
    return (
            <div className="calendar CalendarTaskView-Container-Calendar">
                <div>{header()}</div>
                <div>{days()}</div>
                <div>{cells(passedTasks)}</div>
                {isOpen && <DayPopup handleClose={togglePopup} popupText = {popupText} />}
            </div>
    );
};
export default Calendar;