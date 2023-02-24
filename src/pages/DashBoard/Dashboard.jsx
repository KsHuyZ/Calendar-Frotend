import React, { useContext, useEffect } from 'react'
import socket from '../../config/socket'
import { AuthContext } from '../../context/AuthProvider'
import { Map } from '../../services/goong'

const Dashboard = () => {
    const { setProgress } = useContext(AuthContext)
    useEffect(() => {
        setProgress(100)
    }, [])
    return (
        <div style={{ textAlign: 'center' }}>
           {/* <Map /> */}
        </div>
    )
}

export default Dashboard
