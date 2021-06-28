import Task from './Task'
import {useEffect, useState} from 'react'
import parseISO from 'date-fns/parseISO'
import isSameDay from 'date-fns/isSameDay'

const Tasks = function ({tasks, onDelete, toggleManual, onUpdate, textFilter, datetimeFilter, viewingOptions}) {

    function dragStart(e) {
        setStartZone(e.currentTarget.querySelector('h3').textContent + e.currentTarget.querySelector('p').textContent)
    }

    function dragDrop(e) {
        setDropZone(e.currentTarget.querySelector('h3').textContent + e.currentTarget.querySelector('p').textContent)
    }

    function searchStart(startZone) {
        if (startZone) {
            return tasks.findIndex(element => {
                return (element.priority === 0
                    ? element.text.trim() === startZone.slice(0, -29).trim() && (element.day.slice(0, -12).trim() + ' - ' + element.isoEventEndTime.slice(-18,-13).trim() === startZone.slice(-29).trim())
                    : element.text.trim() === startZone.slice(0, -21).trim() && element.day.slice(0, -12).trim() === startZone.slice(-21).trim())
            })
        }
    }

    function searchDrop(dropZone) {
        if (dropZone) {
            return tasks.findIndex(element => {
                return (element.priority === 0
                    ? element.text.trim() === dropZone.slice(0,-29).trim() && (element.day.slice(0,-12).trim() + ' - ' + element.isoEventEndTime.slice(-18,-13).trim() === dropZone.slice(-29).trim())
                : element.text.trim() === dropZone.slice(0,-21).trim() && element.day.slice(0, -12).trim() === dropZone.slice(-21).trim())
            })
        }
    }

    const [startZone, setStartZone] = useState(null)
    const [dropZone, setDropZone] = useState(null)
    const [startIndex, setStartIndex] = useState(null)
    const [dropIndex, setDropIndex] = useState(null)

    // used for Manual Tasks (initialized to MongoDB side)
    // whenever Drag n Drop used, Tasks.js is re-rendered (causing new MongoDB side to be captured!)
    useEffect(() => {
            setStartIndex(searchStart(startZone))
            setDropIndex(searchDrop(dropZone))
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [startZone, dropZone, tasks[startIndex], tasks[dropIndex]]
    )

    function onDropFunc() {
        if (toggleManual) {
            let tmp = tasks[startIndex]
            tasks[startIndex] = tasks[dropIndex]
            tasks[dropIndex] = tmp
            onUpdate(tasks)
        }

        // prevent Snowball effect
        setStartIndex(null)
        setDropIndex(null)
    }

    function handleviewingOptions (task) {
        switch(viewingOptions) {
            case '0' : return (task.priority !== 0)    // only view Tasks (viewingOptions === 0)
            case '1' : return (task.priority === 0)    // only view Events (viewingOptions === 1)
            default : return true                    // view both Tasks and Events
        }
    }

    return (
        <>
            {
                tasks.map(     // For each index in tasks Object Array, run the function defined below on each index
                    // hide Task components that fail the Search filter
                    (task, index) => task
                    && task.text.includes(textFilter)
                    && (isSameDay(parseISO(datetimeFilter), parseISO(task.isoDay)) || datetimeFilter === '')
                    && handleviewingOptions(task) ?
                        (
                            // Function returns a user-defined Task Component
                            <Task
                                key={index}         /* Store each task.id into key variable */
                                task={task}         /* Pass in task as Prop into Task.js, using variable task */
                                onDelete={onDelete} /* Pass in onDelete as Prop into Task.js, using variable onDelete*/
                                dragStart={dragStart}
                                dragDrop={dragDrop}
                                onDropFunc={onDropFunc}
                            />
                        ) : null
                )
            }
        </>
    )
}

export default Tasks
