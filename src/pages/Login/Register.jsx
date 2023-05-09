import React, { useState } from "react";
import { userApi } from "../../api/userApi";
import { notfifyError, notifySuccess } from "../../lib/toastify";
import LoadingButton from '@mui/lab/LoadingButton';

const Register = ({ setPreview }) => {

  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [avatar, setAvatar] = useState(null)
  const [loading, setLoading] = useState(false)
  const { registerUser } = userApi

  const handleRegister = async (e) => {
    e.preventDefault()

    setLoading(true)
    const res = await registerUser(userName, email, password, phoneNumber, avatar)
    setLoading(false)
    if (res) return notifySuccess("Please check your mail and active this account")
    return notfifyError("Email already exist")

  }

  const handleSelectImage = (e) => {
    const file = e.target.files[0]
    console.log(file)
    const tempUrl = URL.createObjectURL(file)
    setPreview(tempUrl)
    setTimeout(() => {
      URL.revokeObjectURL(tempUrl)
    }, 1000)

    setAvatar(file)
  }

  return (
    <form className="user-form" onSubmit={handleRegister}>
      <div className="form-group">
        <input type="text" className="form-control" id="name" name="name" placeholder="Type Name" value={userName} onChange={(e) => setUserName(e.target.value)} />
      </div>
      <div className="form-group">
        <div className="emty-email" />
        <input type="email" name="email" className="form-control" id="email" placeholder="Type Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="form-group">
        <div className="empty-password" />
        <input type="password" className="form-control" name="password" id="password" placeholder="Type Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="form-group">
        <input type="phone" className="form-control" name="phone" placeholder="Type Phone Number" id="phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
      </div>
      <div className="form-group">
        <input type="file" className="form-control" name="avatar" id="avatar" onChange={handleSelectImage} />
      </div>
      <div className="form-button">
        <LoadingButton type="submit" loading={loading} variant="contained" >Register</LoadingButton>
      </div>
    </form>

  );
};

export default Register;
