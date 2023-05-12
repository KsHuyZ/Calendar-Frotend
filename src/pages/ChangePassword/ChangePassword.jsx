import React from 'react'
import "./change-password.scss"
import { useState } from 'react'
import { Button } from '@mui/material'
import { notfifyError, notifySuccess } from '../../lib/toastify'
import { userApi } from '../../api/userApi'
import { useContext } from 'react'
import { AuthContext } from "../../context/AuthProvider"

const ChangePassword = () => {

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const { user } = useContext(AuthContext)

  const { changePassword, forgotPassword } = userApi

  const handleUpdatePassword = async () => {
    if (newPassword === "" || confirmPassword === "") return notfifyError("Please enter all field")
    if (newPassword !== confirmPassword) return notfifyError("New Pasword and Confirm Password is not same")

    const res = await changePassword(user._id, currentPassword, newPassword)
    if (res.success) {
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      return notifySuccess("Update password success!")
    }
    if (res.msg === "wrong_password") return notfifyError("Wrong Password")
  }

  const handleForgotPassword = async () => {
    const res = await forgotPassword(user._id)
    if (res.success) return notifySuccess("Your new password is send to email!")
  }

  return (
    <>
      <div className='change-password-section'>
        <div className="form-group">
          <div className="title"><p>Current Password</p></div>
          <input type="text" className='form-control' value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        </div>
        <div className="form-group">
          <div className="title"><p>New Password</p></div>
          <input type="text" className='form-control' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>
        <div className="form-group">
          <div className="title"><p>Confirm New Password</p></div>
          <input type="text" className='form-control' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        <div className="change-password">
          <Button variant="outlined" onClick={handleForgotPassword}>Forgot password ?</Button>
          <Button variant="contained" onClick={handleUpdatePassword}>Save new password</Button>
        </div>
      </div>

    </>
  )
}

export default ChangePassword
