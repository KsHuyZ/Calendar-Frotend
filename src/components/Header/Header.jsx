import React, { useContext, useState } from "react";
import "./header.scss"
import { AiOutlineSearch } from "react-icons/ai"
import { IoMdNotificationsOutline } from "react-icons/io"
import { AuthContext } from "../../context/AuthProvider"
import { Menu, MenuItem } from "@mui/material";

const Header = () => {




  const { user: { displayName, photoURL, auth } } = useContext(AuthContext)
  const [anchorEl, setAnchoEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleLogout = () => {
    auth.signOut()
  }

  return (
    <div className="menu-header">
      <div className="left-side">
        <div className="app-name">
          <h1>My Schedule</h1>
        </div>
        {/* <div className="col" /> */}
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
          <IoMdNotificationsOutline />
          <div className="number">6</div>
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
