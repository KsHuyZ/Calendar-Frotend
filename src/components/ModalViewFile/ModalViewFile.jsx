import React from 'react'
import "./modalview-file.scss"
import get_url_extension from '../../utils/getFileType'
import { Button } from '@mui/material'
import { RiCloseFill } from "react-icons/ri"
import downloadfile from '../../utils/downloadFile'

const ModalViewFile = ({ url, close, fileName }) => {


    const handleRenderByfileType = () => {
        const fileType = get_url_extension(url)
        console.log("file: ", fileType)
        switch (fileType) {
            case "pdf":
                return <embed src={url} />
            case "jpg":
                return <img src={url} alt="" />
            case "svg":
                return <img src={url} alt="" />
            case "png":
                return <img src={url} alt="" />
            case "docx":
                return <iframe src={`https://docs.google.com/gview?url=${url}&embedded=true`} title='doc file'></iframe>

            case "doc":
                return <iframe src={`https://docs.google.com/gview?url=${url}&embedded=true`} title='doc file'></iframe>

            default:
                return (
                    <div className="not-support">
                        <p>We doesn't support this file type</p>
                        <Button type='primary' onClick={() => downloadfile(url, fileName)}>Download</Button>
                    </div>
                )
        }
    }

    return (
        <div className="background show">
            <div className="modal show">
                <div className="title-bar">
                    <RiCloseFill color='#5f6368' onClick={close} />
                </div>
                {handleRenderByfileType()}
            </div>
        </div>


    )
}

export default ModalViewFile
