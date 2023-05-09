import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./user-auth.css"
import { RiGoogleFill } from "react-icons/ri"
import { getAuth, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider } from 'firebase/auth'
import { AuthContext } from '../../context/AuthProvider'
import { userApi } from '../../api/userApi'
import { useState } from 'react'
import Register from './Register'
import { notfifyError } from '../../lib/toastify'
import LoadingButton from '@mui/lab/LoadingButton';

const Login = () => {
  const auth = getAuth()
  const navigate = useNavigate()
  const { authByGoogle, login } = userApi
  const [isLoginForm, setIsLoginForm] = useState(true)
  const [preview, setPreview] = useState(null)
  const [formValue, setFormValue] = useState({
    email: "",
    pasword: ""
  })
  const [loading, setLoading] = useState(false)
  const [loadingGG, setLoadingGG] = useState(false)
  const { setUser } = useContext(AuthContext);

  const handleInputChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    setFormValue({ ...formValue, [name]: value })
  }

  const handleLoginWithGoogle = async () => {
    setLoadingGG(true)
    const provider = new GoogleAuthProvider()
    try {
      const res = await signInWithPopup(auth, provider)
      const { displayName, email, photoURL } = res.user
      const success = await authByGoogle(displayName, email, photoURL)
      if (success) {
        setUser(success.user);
        localStorage.setItem("accessToken", success.accessToken)
        localStorage.setItem("refreshToken", success.refreshToken)
        return navigate("/")
      }
    } catch (error) {
      console.log(error)
    }
    setLoadingGG(false)

  }

  const handleLoginWithFacebook = async () => {
    const provider = new FacebookAuthProvider()
    const res = await signInWithPopup(auth, provider)
    console.log(res)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const res = await login(formValue.email, formValue.password)
    setLoading(false)

    if (res) {
      setUser(res)
      return navigate("/")
    }
    notfifyError("Login failed")
  }

  return (
    <section className="user-form-part">
      <div className="container" style={{ margin: "0 12vw" }}>
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-12 col-lg-12 col-xl-10">
            <div className="user-form-logo"><Link to="index.html"><Link to="#" className="logo"> MySchedule </Link></Link></div>
            <div className="user-form-card">
              <div className="user-form-title">
                <h2>Welcome to MySchedule</h2>
              </div>
              <div className="user-form-group">
                <ul className="user-form-social">
                  <li><Link to="#" className="facebook"><i className="fab fa-facebook-f" onClick={handleLoginWithFacebook}></i>Đăng nhập với Facebook</Link></li>
                  <li><Link to="#" className="google" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={handleLoginWithGoogle}>
                    <RiGoogleFill style={{ fontSize: 20, marginRight: 5 }} /> Đăng nhập với Google
                  </Link></li>
                  {!isLoginForm && preview ? <li><img style={{ width: 300 }} src={preview} alt="" /> </li> : null}
                </ul>
                <div className="user-form-divider">
                  <p>or</p>
                </div>
                {isLoginForm ? <form className="user-form" onSubmit={handleLogin} >
                  <div className="form-group">
                    <input type="email" name="email" id="email" className="form-control"
                      placeholder="Type email" onChange={handleInputChange} />
                  </div>
                  <div className="form-group"><input type="password" id="password" name="password" className="form-control"
                    placeholder="Type password" onChange={handleInputChange} />
                  </div>

                  <div className="form-button">
                    <LoadingButton type="submit" loading={loading} variant="contained" >Log in</LoadingButton>
                    <p>Forgot password?<Link id="reset">Reset</Link></p>
                  </div>
                </form> : <Register setPreview={setPreview} />}
              </div>
            </div>
            <div className="user-form-remind">
              {isLoginForm ? <p>Haven't account?<Link to="#" onClick={() => setIsLoginForm(false)}>Register now</Link></p> : <p>Already have an account<Link to="#" onClick={() => setIsLoginForm(true)}>Login now</Link></p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login
