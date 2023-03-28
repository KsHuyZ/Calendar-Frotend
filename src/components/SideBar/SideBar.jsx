import React, { useContext, useEffect } from 'react'
import { FcCalendar } from "react-icons/fc"
import { TbCalendarEvent, TbHome2, TbShare } from "react-icons/tb"
import { RiArrowDropDownFill } from "react-icons/ri"
import "./side-bar.scss"
import { useState } from 'react'
import { userApi } from '../../api/userApi'
import { AuthContext } from '../../context/AuthProvider'
import { Link, NavLink } from 'react-router-dom'
import { AiOutlinePlusCircle } from "react-icons/ai"
import ModalCreateCal from '../ModalCreateCal/ModalCreateCal'
import socket from '../../config/socket'

const NAV__LINKS = [
  {
    display: "Dashboard",
    url: "/",
    icon: <TbHome2 />
  },

];



const SideBar = () => {
  let [scheduleClick, setScheduleClick] = useState(false)
  // let scheduleClick = false
  const [calendars, setCalendars] = useState([])
  const { user } = useContext(AuthContext)
  const { getCalendarbyUserId } = userApi
  const [showModal, setShowModal] = useState(false)

  const handleGetCalendarList = async (id, signal) => {
    const calendars = await getCalendarbyUserId(id, signal)
    if (calendars) {
      setCalendars(calendars)
    }
  }

  const handleClick = () => {
    console.log("Is clicked")
    setScheduleClick(!scheduleClick)
  }

  useEffect(() => {
    socket.on("accept-success", ({ id, idUser }) => {
      handleGetCalendarList(idUser)
    })

    return () => socket.off("accept-success")
  }, [socket])

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    if (user._id) handleGetCalendarList(user._id, signal)
    return () => {
      controller.abort()
    }
  }, [user])

  return (
    <div className='sidebar'>
      <ModalCreateCal show={showModal} close={() => setShowModal(false)} newCalendar={setCalendars} />
      <div className="logo">
        <FcCalendar style={{ fontSize: 40 }} />
        <div>My Schedules</div>
      </div>
      <div className="sidebar-list">
        {NAV__LINKS.map((item, index) => (
          <NavLink key={index} className={(navClass) => `item ${navClass.isActive ? "active" : ""}`} to={item.url} >
            <div className="item-content">
              <div className="item-option">
                <div className="title-item">
                  {item.icon}
                  <div>{item.display}</div>
                </div>
              </div>
            </div>
          </NavLink>
        ))}


        <div className="dropdown-item" onClick={handleClick}>
          <div className={`item ${scheduleClick ? "active" : ""}`} >
            <div className="item-content">
              <div className="item-option">
                <div className="title-item">
                  <TbCalendarEvent />
                  <div>Schedule</div>
                </div>
                <RiArrowDropDownFill className={`${scheduleClick ? "active" : ""}`} />
              </div>
            </div>
          </div>

          <div className={`item-dropdown ${scheduleClick ? "show" : ""}`}>
            {calendars.map((calendar, index) => (
              <Link className="content" to={calendar._id} key={index}>
                <div className="schedule-img">
                  <img src={calendar.photoCalendar} alt="" />
                </div>
                <div className="schedule-name">
                  <div>{calendar.calendarName}</div>
                </div>
              </Link>

            ))}
            <div className="create-new" onClick={() => setShowModal(true)}>
              <AiOutlinePlusCircle /> <div> Add Calendar</div>
            </div>
          </div>


        </div>





      </div>
    </div>
  )
}

export default SideBar
