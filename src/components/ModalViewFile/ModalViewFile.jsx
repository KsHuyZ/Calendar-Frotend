import React from 'react'
import "./modalview-file.scss"

const ModalViewFile = (url) => {


    return (
        <div className="background show">
            <div className="modal show">
                <iframe src={url} frameborder="0" title='hi'></iframe>
            </div>
        </div>


    )
}

export default ModalViewFile
