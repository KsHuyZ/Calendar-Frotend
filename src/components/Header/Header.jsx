import React, { useContext, useState } from "react";
import "./header.scss"
import { AiOutlineSearch } from "react-icons/ai"
import { IoMdNotificationsOutline } from "react-icons/io"
import { AuthContext } from "../../context/AuthProvider"
import { Menu, MenuItem } from "@mui/material";
import { useEffect } from "react";
import { notifyApi } from "../../api/notifyApi"
import Notifies from "./Notifies";
import logo from "../../assets/images/logo.svg"
import socket from "../../config/socket";
const Header = () => {

  const { user: { userName, photoURL, auth, id } } = useContext(AuthContext)
  const [anchorEl, setAnchoEl] = useState(null)
  const [allNotifies, setAllNotifies] = useState([])
  const [showNotify, setShowNotify] = useState(false)
  const open = Boolean(anchorEl)
  const { getNotifiesbyUserId } = notifyApi

  const handleGetNotify = async () => {
    if (id) {
      const notifies = await getNotifiesbyUserId(id)
      console.log(notifies)
      setAllNotifies(notifies)
    }
  }

  const handleShowNewNotify = async () => {
    if (Notification.permission === 'granted') {
      new Notification('New message', {
        body: 'You have a new notification',
        icon: logo
      });

    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification('New message', {
            body: 'You have a new notification',
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
    handleGetNotify()
  }, [id])

  useEffect(() => {
    socket.on("new-notify", (notify) => {
      setAllNotifies(pre => [notify, ...pre])
      handleShowNewNotify()
    })
    socket.on("accept-success", ({ id, idUser }) => {
      handleGetNotify(id)
    })
    socket.on("notify-accept-success", (notify) => {
      setAllNotifies(pre => [notify, ...pre])
      handleShowNewNotify()
    })
    return () => {
      socket.off("new-notify")
      socket.off("accept-success")
    }
  }, [socket])

  const handleLogout = () => {
    auth.signOut()
  }

  let notifyCount = 0
  const handleCountNotify = async () => {
    if (allNotifies.length > 0) {
      allNotifies.map(notify => {
        if (!notify.seen) {
          notifyCount++
        }
      })

    }
  }
  handleCountNotify()
  return (
    <div className="menu-header">
      <div className="left-side">
        <div className="app-name">
          <h1>My Schedule</h1>
        </div>

      </div>
      <div className="mid-side">
        <div className="search">
          <input type="text" placeholder="Search" />
          <AiOutlineSearch />
        </div>
      </div>
      <div className="right-side">
        <div className="notification">
          <IoMdNotificationsOutline onClick={() => setShowNotify((pre) => !pre)} />
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
          </div>
          <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={() => setAnchoEl(null)}>
            <MenuItem onClick={handleLogout}>Log out</MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Header;
