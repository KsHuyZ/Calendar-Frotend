import React, { useRef, useState } from "react";
import "./modal.scss"
import { RiCloseFill } from "react-icons/ri"
import { AiOutlineClockCircle } from 'react-icons/ai'
import { TbFileDescription } from "react-icons/tb"
import { MdAttachFile } from 'react-icons/md'
import { IoColorPaletteOutline } from "react-icons/io5"
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FaMapMarkerAlt } from "react-icons/fa"
import { Map } from "../../services/goong"
import axios from "axios";
import showSuggest from "../../hooks/showSuggest";
import getLocation from "../../hooks/getLocation";


const Modal = ({ add, close, start, end, show }) => {

  const titleRef = useRef()
  const colorRef = useRef()
  const [description, setDescription] = useState("")
  const [showMap, setShowMap] = useState(false)
  const [location, setLocation] = useState({
    lat: 21.0520876,
    lng: 105.8065815
  })
  const [currentLocation, setCurrentLocation] = useState("")
  const [suggests, setSuggests] = useState([])
  const handleSubmit = async () => {
    const title = titleRef.current.value
    const color = colorRef.current.value

    if (title === "" || description === "") return
    const locationObject = {
      address: currentLocation, latitude: location.lat, longitude: location.lng
    }
    await add(title, color, description, start, end, locationObject)
    close(false)
    setShowMap(false)
    handleCloseModal()
  }

  const handleShowSuggest = async (e) => {
    const value = e.target.value
    setCurrentLocation(value)
    if (value.length > 2) {
      const suggest = await showSuggest(value)
      setSuggests(suggest)
    }
  }

  const handleSetLocation = async (value) => {
    const location = await getLocation(value)
    console.log(location)
    setLocation(location.geometry.location)
    setCurrentLocation(location["formatted_address"])
    setSuggests([])
  }

  const handleCloseModal = async () => {
    close(false)
    setShowMap(false)
    setCurrentLocation("")
    titleRef.current.value = ""
    colorRef.current.value = "#3174ad"
    setDescription("")

  }

  // console.log(handleSetLocation())
  return <div className={`background ${show ? "show" : ""}`} >
    <div className="map">
      {showMap ? <Map long={location.lng} lat={location.lat} /> : ""}
    </div>
    <div className={`modal ${show ? "show" : ""}`} style={showMap ? { left: "5%" } : null}>
      <div className="header">
        <div className="close-btn" >
          <RiCloseFill onClick={handleCloseModal} />
        </div>
      </div>
      <div className="main-body">
        <div className="title row">
          <TextField id="standard-basic" label="Event title" variant="standard" style={{ width: "90%" }} inputRef={titleRef} autoFocus={show} />
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
                // console.log('Editor is ready to use!', editor);
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setDescription(data)
                // console.log({ event, editor, data });
              }}
              onBlur={(event, editor) => {
                // console.log('Blur.', editor);
              }}
              onFocus={(event, editor) => {
                // console.log('Focus.', editor);
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
        <div className="location row">
          <FaMapMarkerAlt />

          <TextField id="filled-basic" label="Location" variant="filled" fullWidth style={{ marginLeft: 13 }} size={"small"} onFocus={() => setShowMap(true)} onBlur={() => {
            if (location.length > 0) {
              setShowMap(false)
            }
          }} onChange={handleShowSuggest} value={currentLocation} />
          <div className="dropdown">
            {suggests.map(suggest => (
              <div className="dropdown-row" onClick={() => handleSetLocation(suggest["place_id"])}>

                <div className="icon-mark">
                  <FaMapMarkerAlt />
                </div>
                <div className="location">{suggest.description}</div>
              </div>
            ))}
          </div>


        </div>
      </div>

      <div className="button" onClick={handleSubmit}>
        <button >Submit</button>
      </div>

    </div>
  </div>;
};

export default Modal;
