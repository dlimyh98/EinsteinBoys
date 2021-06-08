import React, {useEffect, useState} from "react";
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
import moment from "moment";  // Date to ISO 9075 format (with options)

const Calendar = ({tasks, isPriority}) => {
    // Default State is current Day
    const [currentDate, setCurrentDate] = useState(new Date());     // for Calendar to render proper month
    const [selectedDate, setSelectedDate] = useState(new Date());   // styling for selected Date
    const [isActive, setActive] = useState(false);

    const toggleClass = () => {
        setActive(!isActive)
    }

    // Add 1 to current Month
    const nextMonth = () => { setCurrentDate(addMonths(currentDate, 1)); };

    // Deduct 1 from current Month
    const prevMonth = () => { setCurrentDate(subMonths(currentDate, 1)); };

    // sets how Header (Month/Year) is displayed
    const header = () => {
        const dateFormat = "MMMM yyyy";
        return (
            <div className="header row flex-middle">

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
                <div className="column col-center" key={i}>
                    {format(addDays(startDate, i), dateFormat)}
                </div>
            );
        }
        return <div className="days row">{days}</div>;
    };

    const onDateClick = day => {
        setSelectedDate(day);
    }

    // sets how EACH cell is populated
    const cells = () => {
        const monthStart = startOfMonth(currentDate);    // when does month start
        const monthEnd = endOfMonth(monthStart);         // when does month end
        const startDate = startOfWeek(monthStart);       // gets first day of CURRENT month, for our calendar to display on that month
        const endDate = endOfWeek(monthEnd);             // final date of the CURRENT month, use as a check against
        const dateFormat = "d";                          // render correct date in each cell
        const rows = [];                                 // render all weeks of given month
        let days = [];                                   // render each day in the week
        let day = startDate;                             // points to start date of CURRENT month
        let formattedDate = "";

        // Not the best implementation, but I can't think of any other way to deal with the asynchronous nature of tasks.sort in Tasks.js
        if (isPriority) {
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

        // Determines color of Tasks in storageArray (according to Priority)
        function TaskToCalendarColoring (tasks,traversal) {
            if (tasks[traversal]) {
                switch (tasks[traversal].priority) {
                    case 3 : return "Red"
                    case 2 : return "Yellow"
                    case 1 : return "Green"
                    case 0 : return "Black"
                    default : return "Blue"
                }
            }
        }

        let traversal = 0;  // Initializing to zero ONCE

        // Extract Tasks from database to Array
        function TaskToCalendar(tasks, traversal, day) {

            let tmp = [];
            while (tasks[traversal]) {
                if (isSameDay(parseISO(tasks[traversal].isoDay), day)) {
                    tmp.push(
                        <div key={parseISO(tasks[traversal].isoDay) + tasks[traversal].text}>
                        <span
                            //onClick = { () => 'activeDate'}
                        >
                            {tasks[traversal].text}
                        </span>
                            <span style={{color: TaskToCalendarColoring(tasks, traversal)}}>
                            {formatISO9075(parseISO(tasks[traversal].isoDay), {representation: 'time'}).slice(0, -3)}
                        </span>
                        </div>)
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
                const {storageArray} = TaskToCalendar(tasks, traversal, day)
                traversal = 0   // RESET the modified traversal value

                days.push(
                    <div
                        className={`column cell ${!isSameMonth(day, monthStart)    // Checking if each cell actually belongs to the current Month
                            ? "disabled" :
                            isSameDay(day, currentDate) ? "flashy" :
                                isSameDay(day, selectedDate) ? "selected" : ""}`}  // Checking if particular cell is same date as currentDate
                        key={day}
                        onClick={() => onDateClick(toDate(cloneDay))}              // sets currentDate hook to whatever cell is being clicked on
                    >
                        <span className="number">{formattedDate}</span>
                        <span className="bg">{formattedDate}</span>
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

    // Rendering
    return (
        <div className="calendar">
            <div>{header()}</div>
            <div>{days()}</div>
            <div>{cells()}</div>
        </div>
    );
};
export default Calendar;