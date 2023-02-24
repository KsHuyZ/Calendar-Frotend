import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthProvider'
import { notifyApi } from "../../api/notifyApi"

const Notifies = ({ show, notifies, setNotifies }) => {

    const { seenNotify } = notifyApi

    const { socket } = useContext(AuthContext)
    const handleCheckTimePast = (createdAt) => {
        const now = Date.now()
        const createTime = new Date(createdAt)
        const timePast = now - createTime
        if (timePast / 1000 > 86400) {
            return `${parseInt(timePast / 86400000)} days ago`
        }
        else if (timePast / 1000 > 3600) {
            return `${parseInt(timePast / 3600000)} hours ago`
        } else if (timePast / 1000 > 60) {
            return `${parseInt(timePast / 60000)} minutes ago`
        } else {
            return `${parseInt(timePast / 1000)} seconds ago`
        }

    }
    const handleAcceptNotifyInvited = (id, idSchedule, idUserSend) => {
        return socket.emit("accept-join", ({ id, idSchedule, idUserSend }))
    }

    const handleSeenNotify = async (id) => {
        const success = await seenNotify(id)
        if (success) {
            setNotifies((pre) => {
                const notifyIndex = pre.findIndex((notify) => notify._id === id)
                pre[notifyIndex].seen = true
                return [...pre]
            })
        }
    }

    return (
        <div className={`notify-list ${show ? "show" : ""}`}>
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
                    {notifies.map((notify, index) => (

                        <div className="notify" key={index} onClick={!notify.seen ? () => handleSeenNotify(notify._id) : null}>
                            <div className="image-send">
                                <img src={notify.idUserSend.photoURL} alt="" />
                            </div>
                            <div className="notify-infor">
                                <div className="title-infor">
                                    <div>{notify.msg} </div>
                                </div>
                                <div className={`time-past ${notify.seen ? "seen" : ""} `}>
                                    {handleCheckTimePast(notify.created_at)}
                                </div>
                                {notify.type === 0 ?
                                    (<div className="action-btns">
                                        {(notify.accept === 0 ?
                                            (<>
                                                <div className="accept-btn" onClick={() => handleAcceptNotifyInvited(notify._id, notify.idSchedule, notify.idUserSend)}>
                                                    <button>Accept</button>
                                                </div>
                                                <div className="denied-btn">
                                                    <button>Deny</button>
                                                </div>
                                            </>) :
                                            (notify.accept === 1 ?
                                                <div className='check-accept'>Invitation accepted</div> :
                                                <div className='check-accept'>Invitation denied</div>))}
                                    </div>) : ""
                                }
                            </div>
                            {!notify.seen ? <div className="new-notify" /> : ""}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Notifies