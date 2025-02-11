export default function Event({name, startHour, endHour, startMinute, endMinute}: {name: string, startHour: string, endHour: string, startMinute: string, endMinute: string}) {
    return (
        <div className="event-container">
            <h3 className="event-name">{name}</h3>
            <div className="event-time">
                {startHour}:{startMinute} - {endHour}:{endMinute}
            </div>
        </div>
    )
}