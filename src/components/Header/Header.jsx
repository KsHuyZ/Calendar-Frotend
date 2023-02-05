import React, { useContext, useState } from "react";
import "./header.scss"
import { AiOutlineSearch } from "react-icons/ai"
import { IoMdNotificationsOutline } from "react-icons/io"
import { AuthContext } from "../../context/AuthProvider"
import { Menu, MenuItem } from "@mui/material";
import { useEffect } from "react";
import { notifyApi } from "../../api/notifyApi"

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
      console.log(notify)
      setAllNotifies(pre => pre.push(notify))
    })
    return () => socket.off("new-notify")
  }, [socket])

  const handleLogout = () => {
    auth.signOut()
  }

  const handleCheckTimePast = (createdAt) => {
    const now = Date.now()
    const createTime = new Date(createdAt)
    const timePast = now - createTime
    if (timePast / 1000 > 3600) {
      return `${parseInt(timePast / 3600000)} hours ago`
    } else if (timePast / 1000 > 60) {
      return `${parseInt(timePast / 60000)} minutes ago`
    } else {
      return `${parseInt(timePast / 1000)} seconds ago`
    }

  }

  return (
    <div className="menu-header">
      <div className="left-side">
        <div className="app-name">
          <h1>My Schedule</h1>
        </div>
        <div className="next-event">
          <p>6</p> event in month
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
          {allNotifies.length > 0 ? <div className="number">{allNotifies.length}</div> : ""}
        </div>
        <div className={`notify-list ${showNotify ? "show" : ""}`}>
          <div className="notify-layout">
            <div className="title">
              <h2>Notification</h2>
            </div>
            <div className="all-unseen">
              <div className="all">
                <div>All</div>
              </div>
              <div className="unseen">
                <div>Unread</div>
              </div>
            </div>
            <div className="notifies-map">
              {allNotifies.map((notify, index) => (
                <div className="notify" key={index}>
                  <div className="image-send">
                    <img src={notify.idUserSend.photoURL} alt="" />
                  </div>
                  <div className="notify-infor">
                    <div className="title-infor">
                      <div>{notify.msg}</div>
                    </div>
                    <div className="time-past">
                      {handleCheckTimePast(notify.created_at)}
                    </div>
                    <div className="action-btns">
                      <div className="accept-btn">
                        <button>Accept</button>
                      </div>
                      <div className="denied-btn">
                        <button>Denied</button>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
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
