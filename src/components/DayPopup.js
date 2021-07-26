import "./DayPopUp.css"
import formatISO9075 from "date-fns/formatISO9075";
import parseISO from "date-fns/parseISO";

function displayTaskorEvent(element) {
    return (element.priority === 0 ?
        formatISO9075(parseISO(element.isoDay), {representation: 'time'}).slice(0, -3)
        + "-" + formatISO9075(parseISO(element.isoEventEndTime), {representation: 'time'}).slice(0, -3)
        : formatISO9075(parseISO(element.isoDay), {representation: 'time'}).slice(0, -3))
}

const DayPopup = ({handleClose, popupText}) => {
    return (
        <div className="popup-box">
            <div className="box">
                <span className = 'close-icon' onClick = {handleClose}> x </span>
                {
                    popupText.map(
                        (element) => (
                            <div key = {element._id}>
                                <span> {element.text} </span>
                                <span style = {{color: element.eventColor}}> {displayTaskorEvent(element)} </span>
                                <span style = {{fontStyle : "italic", color : "gray"}} > {element.additionalRemarks}</span>
                            </div>
                        )

                    )
                }
            </div>
        </div>
    );
}

export default DayPopup
