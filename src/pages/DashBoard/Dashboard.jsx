import React, { useContext, useEffect, useState } from 'react'
import socket from '../../config/socket'
import { AuthContext } from '../../context/AuthProvider'
import { Map } from '../../services/goong'
import Weather from '../../components/Weather/Weather'
import { TextField } from '@mui/material'
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import "./dashboard.scss"
import eventAttenteeApi from '../../api/eventAttenteeApi'
import dayjs from 'dayjs'
import CircularProgress from '@mui/material/CircularProgress';

const isObjectEmpty = (objectName) => {
    return Object.keys(objectName).length === 0
}

const Dashboard = () => {
    const { setProgress, user } = useContext(AuthContext)

    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(false)
    const { getCommingEvents } = eventAttenteeApi


    const handleGetCommingEvents = async () => {
        setLoading(true)
        const data = await getCommingEvents(user._id)
        setEvents(data.events)
        setLoading(false)
    }
    useEffect(() => {
        if (!isObjectEmpty(user)) {
            handleGetCommingEvents()
            setProgress(100)
        }
    }, [user])

    return (
        <div className="dashboard">
            <div className='row'>
                <div className="comming-events">
                    <div className="title"><h3>Up Comming Events</h3></div>
                    <div className="list-event">
                        {events.length > 0 && !loading ? events.map(event => (
                            <div className="event">
                                <div className="color-time">
                                    <div className="color" style={{ backgroundColor: event.backgroundColor }} />
                                    <div className="time">{dayjs(event.start).isSame(dayjs(event.end).subtract(1, 'day')) ? dayjs(event.start).format("DD/MM/YYYY") : `${dayjs(event.start).format("DD/MM/YYYY")} - ${dayjs(event.end).format("DD/MM/YYYY")} `}</div>
                                </div>
                                <div className="title">
                                    <h4>{event.title}</h4>
                                </div>
                                <div className="description" dangerouslySetInnerHTML={{ __html: event.description }}>

                                </div>
                            </div>
                        )) : (!loading && events.length === 0 ? <p>You don't have any upcoming events</p> : loading ? <div className="loading-bar">
                            <CircularProgress />
                        </div> : null)}
                    </div>
                </div>
                <div className="calendar">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <StaticDatePicker
                            displayStaticWrapperAs="desktop"
                            openTo="day"
                            // value={date}
                            // onChange={(newValue) => {
                            //     onNavigate(newValue);
                            // }}
                            // onMonthChange={(value) => onNavigate(value)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </div>
            </div>
            <div className="row">
                <Weather />
            </div>
        </div>

    )
}

export default Dashboard
