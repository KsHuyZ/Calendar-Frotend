import React, { useContext, useState } from 'react'
import Checkbox from '@mui/material/Checkbox';
import "./modal-share.scss"
import { useParams } from 'react-router-dom';
import { userApi } from '../../api/userApi';
import { scheduleApi } from '../../api/scheduleApi';
import { AuthContext } from '../../context/AuthProvider';
import { notifyInfor } from '../../lib/toastify';
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const ModalShare = ({ close }) => {
    const { id } = useParams()
    const [users, setUsers] = useState([])
    const [value, setValue] = useState("")
    const [usersSelected, setUsersSelected] = useState([])
    const { getUserListbyEmail } = userApi
    const { user: u, socket } = useContext(AuthContext)
    const [permission, setPermission] = useState({
        "view": true,
        "update": false,
        "share": false
    })

    const handleAddPermission = async (newPermission) => {
        setUsersSelected([...usersSelected, newPermission])
        setValue("")
    }
    const handleDeletePermission = (permissionDel) => {
        const data = usersSelected.filter((permisson, index) => permisson._id !== permissionDel._id)
        setUsersSelected(data)
    }

    const handleChangeInput = async (email) => {
        setValue(email)
        if (email !== "") {
            const res = await getUserListbyEmail(email)
            setUsers(res)
        }
    }

    const handleAddUserToSchedule = async () => {
        const users = usersSelected.map(user => user._id)
        socket.emit("invite-join", { users, permissions: permission })
        notifyInfor("Your invitation has been sent")
        // await userJointoSchedule({ users, idSchedule: id, user: user.id, permissions: permission })
    }

    const handleOnChangePermission = (data) => {
        if (data === "view" && permission.view === true) {
            return setPermission({
                "view": false,
                "update": false,
                "share": false
            })
        }
        return setPermission((pre) => {
            return { ...pre, [data]: !pre[data] }
        })
    }

    return (
        <div className='background'>
            <div className="modal-share">
                <h3 className="header">
                    <span>Share</span>
                </h3>
                <div className="body">
                    <div className="email">
                        <div class="form-group">
                            <label for="exampleInputPassword1">Email</label>
                            <div className="tags-input-container">
                                {usersSelected.map((permission, index) => (
                                    <div className="tag-item" key={index}>
                                        <img src={permission.photoURL} alt="" />
                                        <span className="text">{permission.displayName}</span>
                                        <span className="close" onClick={() => handleDeletePermission(permission)}>&times;</span>
                                    </div>
                                ))}
                                <input type="text" className="tags-input" placeholder="Type somthing" onChange={(e) => handleChangeInput(e.target.value)} value={value} />
                            </div>
                            <div className="dropdown">
                                {users.filter((item) => {
                                    const searchTerm = value.toLowerCase();
                                    const permissionName = item.displayName.toLowerCase();
                                    return (
                                        searchTerm &&
                                        permissionName.includes(searchTerm) &&
                                        permissionName !== searchTerm &&
                                        item._id !== u.id
                                    );
                                })
                                    .slice(0, 10)
                                    .map((item) => {
                                        const index = usersSelected.findIndex((user) => user._id === item._id)
                                        if (index === -1) {
                                            return (
                                                < div
                                                    onClick={() => handleAddPermission(item)}
                                                    className="dropdown-row"
                                                    key={item.displayName}>
                                                    <img src={item.photoURL} alt="" className='row-image' />
                                                    <div className="email-name">
                                                        <div className="email">
                                                            {item.email}
                                                        </div>
                                                        <div className="name">
                                                            {item.displayName}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }

                                    })}
                            </div>
                        </div>
                    </div>
                    <div className="options">
                        <div className="view option">
                            <div>View</div>
                            <Checkbox {...label} checked={permission.view} onChange={() => handleOnChangePermission("view")} />
                        </div>
                        <div className="update option">
                            <div>Update</div>
                            <Checkbox {...label} checked={permission.update} onChange={() => handleOnChangePermission("update")} />
                        </div>
                        <div className="share option">
                            <div>Share</div>
                            <Checkbox {...label} checked={permission.share} onChange={() => handleOnChangePermission("share")} />
                        </div>
                    </div>
                </div>

                <div className="footer">
                    <div className="cancel" onClick={close}>
                        <span>Cancel</span>
                    </div>
                    <div className="send" onClick={permission.view && handleAddUserToSchedule}>
                        <span className={`${(!permission.view || usersSelected.length === 0) && "disabled"}`}>Send</span>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ModalShare