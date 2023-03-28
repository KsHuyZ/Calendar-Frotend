import React, { useState } from 'react'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthProvider'
import { notifyApi } from "../../api/notifyApi"
import { eventApi } from '../../api/eventApi'
import ModalDetail from '../ModalDetail/ModalDetail'
import emptyNotify from "../../assets/images/empty.svg"
import socket from '../../config/socket'

const Notifies = ({ show, notifies, setNotifies, acceptFunc }) => {

    const { seenNotify } = notifyApi
    const { getEventbyId, userAcceptJointoEvent } = eventApi
    const [showModal, setShowModal] = useState(false)
    const [event, setEvent] = useState({})
    const handleCheckTimePast = (createdAt) => {
        console.log(createdAt)
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
    const handleAcceptNotifyInvited = (e, id, calendarId, eventId, idUserSend) => {
        console.log("Listening")
        e.stopPropagation();
        return socket.emit("accept-join", ({ id, calendarId, eventId, receiverId: idUserSend }))
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
        console.log("youlo")
        // e.stopPropagation();
        if (!seen) {
            handleSeenNotify(id)
        }


        // if (idEvent) {
        //     const event = await getEventbyId(idEvent)
        //     console.log(event)
        //     setEvent(event)
        //     setShowModal(true)
        // }

    }

    const handleAcceptJoinEvent = async (e, id, idEvent, idUser) => {
        e.stopPropagation();
        const success = await userAcceptJointoEvent(id, idEvent, idUser)
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
                    {notifies.length > 0 ? (



                        notifies.map((notify, index) => (

                            <div className="notify" key={index} onClick={(e) => handleShowEvent(e, notify._id, notify.idEvent, notify.seen)}>
                                <div className="image-send">
                                    <img src={notify.senderId.photoURL} alt="" />
                                </div>
                                <div className="notify-infor">
                                    <div className="title-infor">
                                        <div>{notify.msg} </div>
                                    </div>
                                    <div className={`time-past ${notify.seen ? "seen" : ""} `}>
                                        {handleCheckTimePast(notify.created_at)}
                                    </div>
                                    {notify.status === -1 ? "" : (<div className="action-btns">
                                        {(notify.status === 0 ?
                                            (<>
                                                <div className="accept-btn" onClick={(e) => handleAcceptNotifyInvited(e, notify._id, notify.calendarId, notify.eventId, notify.senderId)}>
                                                    <button>Accept</button>
                                                </div>
                                                <div className="denied-btn">
                                                    <button>Deny</button>
                                                </div>
                                            </>) :
                                            (notify.status === 1 ?
                                                <div className='check-accept'>Invitation accepted</div> :
                                                <div className='check-accept'>Invitation denied</div>))}
                                    </div>
                                    )}

                                </div>
                                {!notify.seen ? <div className="new-notify" /> : ""}
                            </div>
                        ))


                    ) : (<div className='empty-notify'>
                        <img src={emptyNotify} alt="" />
                        <p>You don't have any notifications</p>
                    </div>)}
                </div>
            </div>
        </div>
    )
}

export default Notifies