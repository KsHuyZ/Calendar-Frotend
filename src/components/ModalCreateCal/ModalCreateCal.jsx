import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import { TextField } from '@mui/material'
import React, { useContext, useState } from 'react'
import { IoImageOutline } from "react-icons/io5"
import { TbFileDescription } from 'react-icons/tb'
import { GrFormClose } from "react-icons/gr"
import CircularProgress from '@mui/material/CircularProgress';
import { calendarApi } from "../../api/calendarApi"
import "./modal-create-cal.scss"
import { AuthContext } from '../../context/AuthProvider'
import { notifyPending } from '../../lib/toastify'
const ModalCreateCal = ({ show, close, newCalendar }) => {

    const { createCalendar } = calendarApi
    const { user: { _id } } = useContext(AuthContext)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [imagePreview, setImagePreview] = useState()
    const [loading, setLoading] = useState(false)
    const handleChangeInput = (file) => {
        setLoading(true)
        setImagePreview(file)
        setTimeout(() => {
            setLoading(false)
        }, 500)
    }

    const handleCreateCalendar = async () => {
        if (name === "" || description === "" || !imagePreview) {
            return
        }
        try {
            const calendar = await notifyPending("Creating...", createCalendar(name, description, imagePreview, _id), "Created", "Created Error")
            if (calendar) {
                newCalendar(prev => [...prev, calendar])
            }

        } catch (error) {
            console.log(error)
        }

        close()
    }
    return (
        <div className={`background ${show ? "show" : ""}`}>
            <div className={`modal-create-cal ${show ? "show" : ""}`}>
                <div className="inside">
                    <div className="main-body">
                        <div className="title row">
                            <TextField id="standard-basic" label="Calendar title" variant="standard" style={{ width: "90%" }} autoFocus={show} value={name} onChange={(e) => setName(e.target.value)} />
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
                        <div className="image row">
                            <IoImageOutline />
                            <div className="image-field">
                                <div className="image-group">
                                    {loading ? <CircularProgress /> : (imagePreview ? <div className="have-image">
                                        <img src={URL.createObjectURL(imagePreview)} alt="" />
                                        <GrFormClose style={{ cursor: "pointer", color: "red" }} onClick={() => setImagePreview()} />
                                    </div> : <div className="none-image">
                                        <div className="none-image-form">
                                            <IoImageOutline />
                                            <input type="file" name="" id="" onChange={(e) => handleChangeInput(e.target.files[0])} />
                                            <div>Drop your image here, <span>or browse</span></div>
                                        </div>

                                    </div>)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="footer">
                        <div className="cancel" >
                            <span onClick={close}>Cancel</span>
                        </div>
                        <div className="send" onClick={handleCreateCalendar}>
                            <span>Create</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalCreateCal
