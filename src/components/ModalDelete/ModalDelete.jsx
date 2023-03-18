import React from 'react'
import { RiCloseFill } from "react-icons/ri"
import "./modal-delete.scss"
const ModalDelete = ({ show, name, close, dele }) => {

  const handleDelete = () => {
    dele();
    close()
  }

  return (
    <div className={`background ${show ? "show" : ""}`}>
      <div className={`modal-delete ${show ? "show" : ""}`}>
        <div className="title-bar">
          <RiCloseFill color='#5f6368' onClick={() => close(false)} />
        </div>
        <div className="main-popup">
          <div className="ask">
            Are you sure you want to delete the <b>{name}</b> event?
          </div>
          <div className="action-btns">
            <div className="cancel action-btn" onClick={() => close(false)}>Cancel</div>
            <div className="delete action-btn" onClick={handleDelete}>Delete</div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ModalDelete