import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./user-auth.css"
import { RiGoogleFill } from "react-icons/ri"
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { AuthContext } from '../../context/AuthProvider'
import { userApi } from '../../api/userApi'
import { useQuery } from '@tanstack/react-query'
const Login = () => {
  const auth = getAuth()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const handleLoginWithGoogle = async () => {
    const { authByGoogle } = userApi
    const provider = new GoogleAuthProvider()
    try {
      const res = await signInWithPopup(auth, provider)
      const { displayName, email, photoURL } = res.user
      const success = await authByGoogle(displayName, email, photoURL)
      if (success) return navigate("/")
    } catch (error) {
      console.log(error)
    }

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
                  <li><Link to="#" className="facebook"><i className="fab fa-facebook-f"></i>Đăng nhập với Facebook</Link></li>
                  <li><Link to="#" className="google" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={handleLoginWithGoogle}>
                    <RiGoogleFill style={{ fontSize: 20, marginRight: 5 }} /> Đăng nhập với Google
                  </Link></li>

                </ul>
                <div className="user-form-divider">
                  <p>or</p>
                </div>
                <form className="user-form" >
                  <div className="form-group">
                    <div className="emty-name">
                    </div>
                    <input type="email" name="email" id="email" className="form-control"
                      placeholder="Type email" />
                  </div>
                  <div className="form-group"><input type="password" id="password" name="password" className="form-control"
                    placeholder="Type password" /></div>

                  <div className="form-button">
                    <button type="submit" >Log in</button>
                    <p>Forgot password?<Link id="reset">Reset</Link></p>
                  </div>
                </form>
              </div>
            </div>
            <div className="user-form-remind">
              <p>Haven't account?<Link to="/register">Register now</Link></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login
