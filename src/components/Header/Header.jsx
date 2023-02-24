import React, { useContext, useState } from "react";
import "./header.scss"
import { AiOutlineSearch } from "react-icons/ai"
import { IoMdNotificationsOutline } from "react-icons/io"
import { AuthContext } from "../../context/AuthProvider"
import { Menu, MenuItem } from "@mui/material";
import { useEffect } from "react";
import { notifyApi } from "../../api/notifyApi"
import Notifies from "./Notifies";

const dummyArray = [
  {
    accept: 0,
    created_at: "2023-02-08T14:52:36.958Z",
    idSchedule: "63d3e81081f3543c65ece15e",
    idUser: "63d3e86f81f3543c65ece16f",
    idUserSend: {
      _id: '63d3e81081f3543c65ece15d',
      displayName: 'Huy Phan Tiến',
      email: 'phantienhuy20012002@gmail.com',
      photoURL: 'https://lh3.googleusercontent.com/a/AEdFTp4P19ui9vvqPD1aSfPjG30WjcL1TxW-0PSnrHBK=s96-c',
      schedules: Array(1)
    },
    msg: "Huy Phan Tiến invited you to their schedule",
    seen: true,
    type: 0,
    updated_at: "2023-02-09T16:57:49.631Z",
    _id: "63e3b734e04132070d879085"
  }
]

const Header = () => {

  const { user: { displayName, photoURL, auth, id }, socket } = useContext(AuthContext)
  const [anchorEl, setAnchoEl] = useState(null)
  const [allNotifies, setAllNotifies] = useState([])
  const [showNotify, setShowNotify] = useState(false)
  const open = Boolean(anchorEl)
  const { getNotifiesbyUserId } = notifyApi

  const handleGetNotify = async () => {
    if (id) {
      const notifies = await getNotifiesbyUserId(id)
      setAllNotifies(notifies)
    }
  }

  useEffect(() => {
    handleGetNotify()
  }, [id])

  useEffect(() => {
    socket.on("new-notify", (notify) => {
      setAllNotifies(pre => [notify, ...pre])
    })
    socket.on("accept-success", ({ id, idUser }) => {
      setAllNotifies((pre) => {
        const notifyIndex = pre.findIndex((notify) => notify._id === id)
        pre[notifyIndex].accept = 1
        pre[notifyIndex].seen = true
        return [...pre]
      })
    })
    socket.on("notify-accept-success", (notify) => {
      setAllNotifies(pre => [notify, ...pre])
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
        <Notifies show={showNotify} notifies={allNotifies} setNotifies={setAllNotifies} />
        <div className="profile" onClick={(e) => setAnchoEl(e.currentTarget)}>
          <div className="my-setting">
            <div className="name">{displayName}</div>
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
