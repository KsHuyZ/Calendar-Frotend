import React from 'react'
import "./profile.scss"
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthProvider'
import { Button } from '@mui/material'
import { Email } from '@mui/icons-material'


const Profile = () => {
    const { user } = useContext(AuthContext)
    const { photoURL, userName, email, phoneNumber } = user
    return (
        <>
            <div className="avatar">
                <img src={photoURL} alt="" />
                <div className="change-avatar">
                    <Button variant="outlined">Change Avatar</Button>
                </div>
            </div>
            <div className="profile-infor">

                <div className="form-group">
                    <div className="title"><p>User Name</p></div>
                    <input type="text" className='form-control' value={userName} />
                </div>
                <div className="form-group">
                    <div className="title"><p>Email</p></div>
                    <input type="text" className='form-control' value={email} disabled />
                </div>
                <div className="form-group">
                    <div className="title"><p>Phone number</p></div>
                    <input type="text" className='form-control' value={phoneNumber} />
                </div>
            </div>
            <div className="save-changes">
                <Button variant="contained">Save Changes</Button>
            </div>
        </>
    )
}

export default Profile
