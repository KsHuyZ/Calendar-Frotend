import React, { useRef, useState } from "react";
import "./modal.css"
import { RiCloseFill } from "react-icons/ri"
import { AiOutlineClockCircle } from 'react-icons/ai'
import { TbFileDescription } from "react-icons/tb"
import { MdAttachFile } from 'react-icons/md'
import { IoColorPaletteOutline } from "react-icons/io5"
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { notifyPending } from "../../lib/toastify";

const Modal = ({ add, close, start, end }) => {
  const titleRef = useRef()
  const colorRef = useRef()
  const [description, setDescription] = useState("")
  const handleSubmit = () => {
    const title = titleRef.current.value
    const color = colorRef.current.value
    const id = Math.random()
    if (title === "" || description === "") return
    notifyPending("Saving...", "Saved", "Saving Error", add(id, title, color, description, start, end))
    close(false)
  }



  return <div className="background" >
    <div className="modal">
      <div className="header">
        <div className="close-btn" >
          <RiCloseFill onClick={() => close(false)} />
        </div>
      </div>
      <div className="main-body">
        <div className="title row">
          <TextField id="standard-basic" label="Event title" variant="standard" style={{ width: "90%" }} inputRef={titleRef} autoFocus={() => {
            setTimeout(() => true, 1000)
          }} />
        </div>
        <div className="time row">
          < AiOutlineClockCircle />
          <div className="time-start-end" style={{ marginLeft: 20 }}>
            {dayjs(start).format("DD/MM/YYYY")} - {dayjs(end).format("DD/MM/YYYY")}
          </div>
        </div>
        <div className="description row">
          <TbFileDescription title="description" />
          <div className="ck-edit" >
            <CKEditor

              config={{ placeholder: "Event description" }}
              editor={ClassicEditor}
              data={description}
              onReady={editor => {
                // You can store the "editor" and use when it is needed.
                console.log('Editor is ready to use!', editor);
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setDescription(data)
                console.log({ event, editor, data });
              }}
              onBlur={(event, editor) => {
                console.log('Blur.', editor);
              }}
              onFocus={(event, editor) => {
                console.log('Focus.', editor);
              }}
            />
          </div>
        </div>
        <div className="file row">
          <MdAttachFile />
          <div className="input-file">
            <input type="file" name="" id="" />
            <span className="title">Drop your file there</span>
          </div>

        </div>
        <div className="color row">
          <IoColorPaletteOutline />
          <input type="color" name="" id="" style={{ width: "90%", marginLeft: 20 }} ref={colorRef} defaultValue="#3174ad" />
        </div>
      </div>

      <div className="button" onClick={handleSubmit}>
        <button >Submit</button>
      </div>

    </div>
  </div>;
};

export default Modal;
