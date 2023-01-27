import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../../context/AuthProvider'

const Dashboard = () => {
    const { setProgress } = useContext(AuthContext)
    useEffect(() => {
        setProgress(100)
    }, [])
    return (
        <div style={{ textAlign: 'center' }}>
            <h1>This is Dashboard page</h1>
        </div>
    )
}

export default Dashboard
