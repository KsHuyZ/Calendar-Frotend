import React, { useContext, useState } from "react";
import "./header.scss"
import { IoMdNotificationsOutline } from "react-icons/io"
import { AuthContext } from "../../context/AuthProvider"
import { Menu, MenuItem } from "@mui/material";
import { useEffect } from "react";
import { notifyApi } from "../../api/notifyApi"
import Notifies from "./Notifies";
import logo from "../../assets/images/logo.svg"
import socket from "../../config/socket";
import { FcCalendar } from "react-icons/fc"
import { useNavigate } from "react-router-dom";
const Header = ({ openSideBar, show }) => {

  const { user: { userName, photoURL, _id }, auth, } = useContext(AuthContext)
  const [anchorEl, setAnchoEl] = useState(null)
  const [allNotifies, setAllNotifies] = useState([])
  const [showNotify, setShowNotify] = useState(false)
  const [notifyCount, setNotifyCount] = useState()

  const { setUser } = useContext(AuthContext);

  const open = Boolean(anchorEl)
  const { getNotifiesbyUserId, checkAllNotify } = notifyApi
  const navigate = useNavigate()

  const handleGetNotify = async (id) => {
    const notifies = await getNotifiesbyUserId(id)
    setAllNotifies(notifies)
    const count = handleCountNotify(notifies)
    setNotifyCount(count)
  }

  const handleShowNewNotify = async (msg) => {
    if (Notification.permission === 'granted') {
      new Notification('New notification', {
        body: msg,
        icon: logo
      });

    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification('New notification', {
            body: msg,
            icon: logo
          });
        }
      });
    }
  }

  const handleAccpetNotify = (id) => {
    setAllNotifies((pre) => {
      const notifyIndex = pre.findIndex((notify) => notify._id === id)
      pre[notifyIndex].accept = 1
      pre[notifyIndex].seen = true
      return [...pre]
    })
  }

  useEffect(() => {
    if (_id) {
      handleGetNotify(_id)
    }

  }, [_id])

  useEffect(() => {
    socket.on("new-notify", (notify) => {
      setAllNotifies(pre => [notify, ...pre])
      setNotifyCount(prev => prev + 1)
      handleShowNewNotify(notify.msg)
    })
    socket.on("accept-success", (invitation) => {


      setAllNotifies(prev => {
        const index = prev.findIndex(notify => notify._id === invitation._id)
        let allNotifiesCopy = prev.slice()
        allNotifiesCopy[index] = invitation
        if (index >= 0) {
          return allNotifiesCopy
        }
      })




    })
    socket.on("notify-accept-success", (notify) => {
      console.log("new-notify", notify)
      setAllNotifies(pre => [notify, ...pre])
      handleShowNewNotify(notify.msg)
    })
    return () => {
      socket.off("new-notify")
      socket.off("accept-success")
      socket.off("notify-accept-success")
    }
  }, [socket])

  const handleLogout = () => {
    auth.signOut()
    localStorage.clear()
    setUser({})
    socket.disconnect()
    navigate("/login")
  }


  const handleCountNotify = (notifies) => {
    let count = 0;
    if (notifies.length > 0) {
      notifies.map(notify => {
        console.log(notify.isAction)
        if (!notify.isAction) {
          count++
        }
      })

    }

    return count
  }


  const handleShowNotify = async () => {
    setShowNotify((pre) => !pre)
    if (notifyCount > 0) {
      const success = await checkAllNotify(_id)
      if (success) {
        setAllNotifies(prev => {
          let allNotifiesCopy = prev.slice()
          allNotifiesCopy.forEach((notify, index) => {
            console.log(notify)
            if (!notify.isAction) {
              notify.isAction = true
            }
          })
          return allNotifiesCopy
        })

      }
    }
    setNotifyCount(0)
  }
  return (
    <div className="menu-header">
      <div className="left-side">
        <div className="app-name">
          <div class={`content ${show && "change"}`} onClick={openSideBar} >
            <div className="icon1"></div>
            <div className="icon2"></div>
            <div className="icon3"></div>
          </div>

          <h1>
            <FcCalendar fontSize={40} />
            My Schedule</h1>
        </div>

      </div>

      <div className="right-side">
        <div className="notification">
          <IoMdNotificationsOutline onClick={handleShowNotify} />
          {notifyCount > 0 ? <div className="number">{notifyCount}</div> : ""}
        </div>
        <Notifies show={showNotify} notifies={allNotifies} setNotifies={setAllNotifies} acceptFunc={handleAccpetNotify} />
        <div className="profile" onClick={(e) => setAnchoEl(e.currentTarget)}>
          <div className="my-setting">
            <div className="name">{userName}</div>
            <div className="setting">My settings</div>
          </div>
          <div className="avatar" >
            <img src={photoURL} alt="" />
            <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={() => setAnchoEl(null)}>
              <MenuItem onClick={handleLogout}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Log out</MenuItem>
            </Menu>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Header;
