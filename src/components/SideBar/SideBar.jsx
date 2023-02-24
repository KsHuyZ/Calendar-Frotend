import React, { useContext, useEffect } from 'react'
import { FcCalendar } from "react-icons/fc"
import { TbCalendarEvent, TbHome2, TbShare } from "react-icons/tb"
import { RiArrowDropDownFill } from "react-icons/ri"
import "./side-bar.scss"
import { useState } from 'react'
import { userApi } from '../../api/userApi'
import { AuthContext } from '../../context/AuthProvider'
import { Link, NavLink } from 'react-router-dom'

const NAV__LINKS = [
  {
    display: "Dashboard",
    url: "/",
    icon: <TbHome2 />
  },

];



const SideBar = () => {
  const [scheduleClick, setScheduleClick] = useState(false)
  const [schedules, setSchedules] = useState()
  const { user, socket } = useContext(AuthContext)
  const { getSchedudulesbyUserId } = userApi

  const handleGetSchduleList = async (id) => {
    const schdeules = await getSchedudulesbyUserId(id)
    setSchedules(schdeules)
  }

  useEffect(() => {
    socket.on("accept-success", ({ id, idUser }) => {
      // console.log("accept-success", idUser)
      handleGetSchduleList(idUser)
    })

    return () => socket.off("accept-success")
  }, [socket])

  useEffect(() => {
    if (user.id) handleGetSchduleList(user.id)
  }, [user])

  return (
    <div className='sidebar'>
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


        <div className="dropdown-item">
          <div className={`item ${scheduleClick ? "active" : ""}`} onClick={() => setScheduleClick(!scheduleClick)} >
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

          <div className="item-dropdown">
            {scheduleClick && schedules?.schedules?.map((schedule, index) => (
              <Link className="content" to={schedule._id} key={index}>
                <div className="schedule-img">
                  <img src={schedule.idOwner.photoURL} alt="" />
                </div>
                <div className="schedule-name">
                  <div>{schedules?.email === schedule.idOwner.email ? "My" : `${schedule.idOwner.displayName.split(" ")[0]}'s`} Schedule</div>
                </div>
              </Link>
            ))}
          </div>


        </div>





      </div>
    </div>
  )
}

export default SideBar
