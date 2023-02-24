import React, { useRef, useState } from 'react'
import { BiPencil } from "react-icons/bi"
import { RiMore2Line, RiCloseFill } from "react-icons/ri"
import { IoTrashOutline } from "react-icons/io5"
import "./modal-detail.scss"
import { TbFileDescription, TbCalendarEvent } from 'react-icons/tb'
import { FaMapMarkerAlt } from "react-icons/fa"
import { VscFilePdf } from "react-icons/vsc"
import ModalShare from '../ModalShare/ModalShare'

const ModalDetail = ({ close, event, dele, show }) => {
  const { _id, title, start, end, createdBy, description, backgroundColor, location } = event
  const [showOption, setShowOption] = useState(false)
  const [showModalShare, setShowModalShare] = useState(false)
  const handleDelete = () => {
    close(false)
    dele(_id)
  }



  return (
    <div className={`background ${show ? "show" : ""}`}>
      <ModalShare close={() => setShowModalShare(false)} show={showModalShare} type="event" event={_id} />
      <div className={`modal-detail ${show ? "show" : ""}`}>
        <div className="action-header">
          <div className="left-side">
            <BiPencil />
            <div className="more" onClick={() => setShowOption(prev => !prev)}>
              <RiMore2Line style={{ cursor: 'pointer' }} />
              {showOption && <div className="options">
                <div className="option" onClick={() => setShowModalShare(true)}>Share</div>
              </div>}
            </div>
            <IoTrashOutline onClick={handleDelete} />
            <VscFilePdf />
          </div>
          <div className="close-side" >
            <RiCloseFill onClick={() => close(false)} />
          </div>
        </div>

        <div className="content" id='pdf'>
          <div className="row title">
            <div className="background-color">
              <div className="color" style={{ backgroundColor }} />
            </div>
            <div className="right-side title-day">
              <div className="title">{title}</div>
              <div className="day">{new Date(start).toDateString()} - {new Date(end).toDateString()}</div>
            </div>
          </div>
          <div className="row description">
            <TbFileDescription title="description" />
            <div className="description right-side" dangerouslySetInnerHTML={{ __html: description }} />
          </div>
          <div className="row owner">
            <TbCalendarEvent />
            <div className="right-side owner">
              {createdBy?.displayName}
            </div>
          </div>
          {location ? <div className="row location">
            <FaMapMarkerAlt />
            <div className="right-side location">
              {location?.address}
            </div>
          </div> : null}
        </div>

      </div>
    </div>

  )
}

export default ModalDetail