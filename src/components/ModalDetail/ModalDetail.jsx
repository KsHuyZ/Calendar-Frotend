import React, { useState } from 'react'
import { BiPencil } from "react-icons/bi"
import { RiMore2Line, RiCloseFill } from "react-icons/ri"
import { IoTrashOutline } from "react-icons/io5"
import "./modal-detail.scss"
import { TbFileDescription, TbCalendarEvent } from 'react-icons/tb'
import { FaMapMarkerAlt } from "react-icons/fa"
import { VscFilePdf } from "react-icons/vsc"
import { AiOutlineTeam } from "react-icons/ai"
import { BsFileEarmarkBinary } from "react-icons/bs"
import ModalShare from '../ModalShare/ModalShare'
import { Map } from '../../services/goong'
import ModalDelete from '../ModalDelete/ModalDelete'
import Button from '@mui/material/Button';
import { HiOutlineVideoCamera } from "react-icons/hi2"
import ModalViewFile from '../ModalViewFile/ModalViewFile'
import { useNavigate } from 'react-router-dom'

const ModalDetail = ({ close, event, dele, show }) => {
  const { _id, title, start, end, createdBy, description, backgroundColor, location, userJoin, file, isMeeting } = event
  const [showOption, setShowOption] = useState(false)
  const [showModal, setShowModal] = useState({
    modalShare: false,
    modalDelete: false
  })
  const [showFile, setShowFile] = useState(false)

  const navigate = useNavigate()

  const handleDelete = () => {
    close(false)
    dele(_id)
  }

  const handleJoinMeeting = () => {
    navigate(`/video-chat/${_id}`)
  }

  return (
    <div className={`background ${show ? "show" : ""}`} >
      <div className="map">
        {location ? <Map long={location.longitude} lat={location.latitude} /> : ""}
      </div>
      <ModalDelete show={showModal.modalDelete} name={title} close={() => setShowModal(prev => ({ ...prev, modalDelete: false }))} dele={handleDelete} />
      <ModalShare close={() => setShowModal(prev => ({ ...prev, modalShare: false }))} show={showModal.modalShare} type="event" event={_id} />
      <div className={`modal-detail ${show ? "show" : ""}`} style={location ? { marginLeft: "5%" } : null}>
        <div className="action-header">
          {dele && <div className="left-side">
            <BiPencil />
            <div className="more" onClick={() => setShowOption(prev => !prev)}>
              <RiMore2Line style={{ cursor: 'pointer' }} />
              {showOption && <div className="options">
                <div className="option" onClick={() => setShowModal(prev => ({ ...prev, modalShare: true }))}>Share</div>
              </div>}
            </div>
            <IoTrashOutline onClick={() => setShowModal(prev => ({ ...prev, modalDelete: true }))} />
            <VscFilePdf />
          </div>}
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
              {createdBy?.userName}
            </div>
          </div>
          {location ? <div className="row location">
            <FaMapMarkerAlt />
            <div className="right-side location">
              {location?.address}

            </div>
          </div> : null}

          {isMeeting ? <div className='row meeting'>
            <HiOutlineVideoCamera />
            <div className="right-side location">
              <Button variant="contained" onClick={handleJoinMeeting}>Join meeting</Button>
            </div>
          </div> : null}
          {
            file ? <div className="row file">
              <BsFileEarmarkBinary />
              <div className="right-side file">
                <span style={{ width: 100, overflow: "hidden", lineClamp: 1 }}>{file.fileName}</span>
                <Button variant="contained" onClick={() => setShowFile(true)}>View</Button>
              </div>
            </div> : null
          }
          {
            userJoin?.length > 0 ?
              <div className="row team">
                <AiOutlineTeam />
                <div className="right-side team">
                  {userJoin.map(u => {
                    return <img src={`${u.photoURL}`} alt="" />
                  })}
                </div>
              </div> : null
          }
        </div>

      </div>
      {showFile ? <ModalViewFile url={file.fileUrl} fileName={file.fileName} close={() => setShowFile(false)} /> : null}
    </div>

  )
}

export default ModalDetail