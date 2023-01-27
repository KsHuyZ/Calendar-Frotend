import React, { useEffect, useState } from 'react'
import { BiPencil } from "react-icons/bi"
import { RiMore2Line, RiCloseFill } from "react-icons/ri"
import { IoTrashOutline, IoMailOutline } from "react-icons/io5"
import "./modal-detail.scss"
import { TbFileDescription, TbCalendarEvent } from 'react-icons/tb'
import { userApi } from '../../api/userApi'
import { Skeleton } from '@mui/material';

const ModalDetail = ({ close, event, dele }) => {
  const { getUserbyId } = userApi
  const { _id, title, start, end, createdBy, description, backgroundColor } = event

  const [userName, setUserName] = useState("")
  const [loading, setLoading] = useState(false)

  const handleGetUser = async () => {
    setLoading(true)
    try {
      const userName = await getUserbyId(createdBy)
      setUserName(userName.displayName)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = () => {
    close(false)
    dele(_id)
  }

  useEffect(() => {
    handleGetUser()
  }, [event])
  return (
    <div className="background">
      <div className='modal-detail'>
        <div className="action-header">
          <div className="left-side">
            <BiPencil />
            <RiMore2Line />
            <IoTrashOutline onClick={handleDelete} />
            <IoMailOutline />
          </div>
          <div className="close-side" >
            <RiCloseFill onClick={() => close(false)} />
          </div>

        </div>
        <div className="content">
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
              {!loading ? userName : <Skeleton width={100} />}
            </div>
          </div>

        </div>
      </div>
    </div>

  )
}

export default ModalDetail