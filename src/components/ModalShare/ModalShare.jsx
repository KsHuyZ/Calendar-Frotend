import React from 'react'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox';
import "./modal-share.scss"
import { useParams } from 'react-router-dom';
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
const ModalShare = () => {
    const { id } = useParams()
    console.log(id)
    return (
        <div className='background'>
            <div className="modal-share">
                <h3 className="header">
                    <span>Share</span>
                </h3>
                <div className="body">
                    <div className="email">
                        <TextField id="filled-basic" label="Email" variant="filled" className='input-email' />
                    </div>
                    <div className="view option">
                        <div>View</div>
                        <Checkbox {...label} defaultChecked />
                    </div>
                    <div className="update option">
                        <div>Update</div>
                        <Checkbox {...label} defaultChecked />
                    </div>
                    <div className="share option">
                        <div>Share</div>
                        <Checkbox {...label} defaultChecked />
                    </div>
                </div>

                <div className="footer">
                    <div className="cancel">
                        <span>Cancel</span>
                    </div>
                    <div className="send">
                        <span>Send</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalShare