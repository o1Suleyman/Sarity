export default function Goal({name, completed}) {
    return (
        <div className="flex items-center justify-between">
            <div className="text-xl font-bold">{name}</div>
            <div className="text-xl font-bold">{completed}</div>
        </div>
    )
}