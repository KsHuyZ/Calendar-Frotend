import React, { useState } from 'react'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthProvider'
import { notifyApi } from "../../api/notifyApi"
import { eventApi } from '../../api/eventApi'
import ModalDetail from '../ModalDetail/ModalDetail'
import { notifyPending } from '../../lib/toastify'

const Notifies = ({ show, notifies, setNotifies, acceptFunc }) => {

    const { seenNotify } = notifyApi
    const { getEventbyId, userAcceptJointoEvent } = eventApi
    const [showModal, setShowModal] = useState(false)
    const [event, setEvent] = useState({})
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
        console.log("u")
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

    const handleShowEvent = async (e, id, idEvent, seen) => {
        // e.stopPropagation();
        if (!seen) {
            handleSeenNotify(id)
        }

        if (idEvent) {
            const event = await getEventbyId(idEvent)
            console.log(event)
            setEvent(event)
            setShowModal(true)
        }

    }

    const handleAcceptJoinEvent = async (e, id, idEvent, idUser) => {
        e.stopPropagation();
        const success = await userAcceptJointoEvent(id,idEvent, idUser)
        if (success) return acceptFunc(id)
        return

    }

    return (
        <div className={`notify-list ${show ? "show" : ""}`}>
            <ModalDetail close={setShowModal} event={event} show={showModal} />
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

                        <div className="notify" key={index} onClick={(e) => handleShowEvent(e, notify._id, notify.idEvent, notify.seen)}>
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
                                                <div className="accept-btn" onClick={(e) => !notify.idEvent ? handleAcceptNotifyInvited(notify._id, notify.idSchedule, notify.idUserSend) : handleAcceptJoinEvent(e, notify._id, notify.idEvent, notify.idUser)}>
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