// sidebar for chat icons and working
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './sidebar.css';
import {
  Avatar,
  IconButton,
  Tooltip,
  Button,
  ButtonGroup,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  AddCircleRounded,
  ChatBubble,
  ContentCutOutlined,
  DonutLargeRounded,
  ExitToAppOutlined,
  SearchRounded,
} from '@mui/icons-material';
import Divider from '@mui/material/Divider';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import LogoutIcon from '@mui/icons-material/Logout';
import Sidebarchat from './SidebarChat';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { flexbox } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import LoadingSpinner from './LoadingSpinner';

const Sidebar = ({ rooms, access, isLoading }: any) => {
  // useEffect(() =>
  //   onSnapshot(collection(db,"rooms"),(snapshot) =>
  //         setRooms(snapshot.docs.map((doc) => ({
  //             data:doc.data(),
  //             id: doc.id,

  //         }))))

  // ,[]
  // )
  // const [isLoading, setIsLoading] = useState(false);
  const onChange = (e: any) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const onChangeUser = (e: any, index: number) => {
    const { name, value }: any = e.target;
    const list: any = [...formData.users];
    list[index][name] = value;
    setFormData((prevState) => ({
      ...prevState,
      users: list,
    }));
  };
  const onChangeContact = (e: any, index: number) => {
    const { name, value }: any = e.target;
    const list: any = [...contactData];
    list[index][name] = value;
    setContactData((prevState) => list);
  };
  const navigate = useNavigate();
  const addGroup = async () => {
    const data = {
      name: formData.name,
      type: formData.type,
      users: formData.users.map((user) => {
        return user.address;
      }),
    };
    console.log(data);
    try {
      const res = await axios.post(
        'http://localhost:5000/group',
        JSON.stringify(data),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access}`,
          },
        },
      );

      console.log(res);
      await setFormData({
        name: '',
        type: 'personal',
        users: [{ address: '' }],
      });
      handleClose();
      navigate('/home');
    } catch (err) {
      console.log(err);
      if (err.message === 'jwt expired') {
        localStorage.removeItem('access_token');
        navigate('/');
      }
    }
  };
  const addContact = async () => {
    console.log(contactData);
    try {
      const res = await axios.post(
        'http://localhost:5000/contact',
        JSON.stringify(contactData),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access}`,
          },
        },
      );

      console.log(res);
      await setContactData([{ name: '', address: '' }]);
      handleContactClose();
      navigate('/home');
    } catch (err) {
      console.log(err);
      if (err.message === 'jwt expired') {
        localStorage.removeItem('access_token');
        navigate('/');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/');
    console.log('logout');
  };
  const [seed, setSeed] = useState<any | null>('');
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 1));
  }, []);

  // serach filter
  const [search, setSearch] = useState([]);
  console.log(search);
  const [input, setInput] = useState('');
  const [sidebarBool, setsidebarBool] = useState(true);
  // filters the search according to the alphabert whether CAPS OR SMALL
  const matcher = (s: any, values: any) => {
    const re = RegExp(`.*${s.toLowerCase().split('').join('.*')}.*`);
    return values.filter((v: any) => v.name.toLowerCase().match(re));
  };
  //   sets the search if the room nmae lenght is >0
  useEffect(() => {
    if (rooms.length > 0) {
      setSearch(matcher(input, rooms));
    }
    if (input === '') {
      setsidebarBool(true);
    }
  }, [input]);
  //   value of input changes
  const handleChange = (e: any) => {
    setsidebarBool(false);
    setInput(e.target.value);
  };
  // add room
  const createChat = () => {
    //   const roomName = prompt("Please enter name for chat");
    //   if (roomName && roomName.length >= 20) {
    //     return alert("enter a shorter name for the room");
    //   }
    //   if (roomName) {
    //      addDoc(collection(db, "rooms"), {
    //       name: roomName,

    //     });
    //   }
    console.log('chat created');
  };
  //   photo
  const [open, setOpen] = React.useState(false);
  const [contactOpen, setContactOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleContactOpen = () => setContactOpen(true);
  const handleContactClose = () => setContactOpen(false);
  const handleClose = () => setOpen(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'personal',
    users: [{ address: '' }],
  });
  const [contactData, setContactData] = useState([{ address: '', name: '' }]);
  const addUsers = () => {
    setFormData((pre: any) => ({
      ...pre,
      users: [...pre.users, { id: '', address: '' }],
    }));
  };
  const addContacts = () => {
    const list: any = [...contactData, { address: '', name: '' }];
    console.log(list);
    setContactData(list);
  };
  const removeUsers = (index: number) => {
    const list = [...formData.users];
    list.splice(index, 1);
    setFormData((pre: any) => ({
      ...pre,
      users: list,
    }));
  };
  const removeContacts = (index: number) => {
    const list = [...contactData];
    list.splice(index, 1);
    setContactData((pre: any) => list);
  };
  const [checked, setChecked] = React.useState(true);
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #131c21',
    boxShadow: 24,
    borderRadius: '5%',
    p: 4,
    backgroundColor: '#0b1012',
  };
  const contactStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #131c21',
    borderRadius: '5%',
    boxShadow: 24,
    p: 4,
    backgroundColor: '#0b1012',
  };
  const inputStyle = {
    padding: '10px',
    margin: '2px',
    fontSize: '14px',
    fontFamily: 'sans-serif',
  };
  const photoURL =
    localStorage.getItem('photoURL') !== ''
      ? localStorage.getItem('photoURL')
      : null;
  console.log(photoURL);
  const displayName = localStorage.getItem('displayName');
  return (
    <div className="Sidebar">
      <div className="Sidebar__header">
        <Avatar style={{ marginLeft: '15px' }} src={photoURL} />
        <b className="TEXT">{displayName}</b>
        <div className="Sidebar__headerRight">
          {true ? (
            <>
              <IconButton>
                <Tooltip title="Add Room">
                  <AddCircleRounded
                    onClick={handleOpen}
                    fontSize="large"
                    style={{ color: '#B1B3B5' }}
                  />
                </Tooltip>
              </IconButton>
              <IconButton>
                <Tooltip title="Add/ Edit Contact">
                  <PersonAddAlt1Icon
                    onClick={handleContactOpen}
                    fontSize="large"
                    style={{ color: '#B1B3B5' }}
                  />
                </Tooltip>
              </IconButton>
              <IconButton>
                <Tooltip title="Logout">
                  <LogoutIcon
                    onClick={() => {
                      logout();
                    }}
                    fontSize="large"
                    style={{ color: '#B1B3B5' }}
                  />
                </Tooltip>
              </IconButton>
            </>
          ) : (
            <LoadingSpinner />
          )}

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <div
                className=""
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  rowGap: 4,
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',

                    padding: 6,
                    paddingLeft: 16,
                    paddingRight: 16,
                    rowGap: 4,
                    border: '1px solid white',
                    borderRadius: 25,
                  }}
                >
                  <div
                    style={{
                      fontSize: 26,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      marginBottom: 10,
                      marginTop: 10,
                    }}
                  >
                    Add Group
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div
                      className=""
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '5%',
                      }}
                    >
                      <div>Group Name :</div>
                      <input
                        style={inputStyle}
                        placeholder="Group Name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={onChange}
                      />

                      <PersonRemoveIcon
                        style={{
                          fontSize: '30px',
                          color: '#0b1012',
                          cursor: 'default',
                        }}
                      />
                    </div>
                    {formData.users.map((user: any, index: number) => {
                      return (
                        <div
                          className=""
                          key={index}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            columnGap: 3,
                            justifyContent: 'space-between',
                          }}
                        >
                          <div>User{index + 1} Address :</div>
                          <input
                            style={inputStyle}
                            placeholder="Address"
                            name="address"
                            type="text"
                            value={user.address}
                            onChange={(e) => onChangeUser(e, index)}
                          />
                          {formData.users.length > 1 ? (
                            <IconButton
                              onClick={() => removeUsers(index)}
                              style={{}}
                            >
                              <PersonRemoveIcon
                                key={index}
                                style={{
                                  fontSize: '25px',
                                  cursor: 'pointer',
                                  color: '#B1B3B5',
                                }}
                              />
                            </IconButton>
                          ) : (
                            <PersonRemoveIcon
                              style={{
                                fontSize: '40px',
                                color: '#0b1012',
                                cursor: 'default',
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '2%',
                    }}
                  >
                    <div>Personal</div>

                    <div style={{ width: '70%', alignItems: 'left' }}>
                      <Switch
                        checked={checked}
                        onChange={() => {
                          setFormData((prev) => ({
                            ...prev,
                            type: checked ? 'group' : 'personal',
                          }));
                          setChecked(!checked);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <ButtonGroup
                  variant="contained"
                  aria-label="small button group"
                  style={{ display: 'flex', justifyContent: 'center' }}
                  disableElevation
                >
                  <Button className="submitBtn" onClick={addUsers}>
                    {' '}
                    Add User
                  </Button>

                  <Button
                    className="submitBtn"
                    onClick={() => {
                      addGroup();
                    }}
                  >
                    {' '}
                    submit
                  </Button>
                </ButtonGroup>
              </div>
            </Box>
          </Modal>
          {
            //for Contacts
          }
          <Modal
            open={contactOpen}
            onClose={handleContactClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={contactStyle}>
              <div
                className=""
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  rowGap: 4,
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 6,
                    paddingLeft: 16,
                    paddingRight: 16,
                    rowGap: '5%',
                    border: '1px solid white',
                    borderRadius: 25,
                  }}
                >
                  <div
                    style={{
                      fontSize: 26,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      marginBottom: '2%',
                      marginTop: '2%',
                    }}
                  >
                    Add Contacts
                  </div>

                  {contactData.map((user: any, index: number) => {
                    return (
                      <div
                        className=""
                        key={index}
                        style={{
                          display: 'flex',
                          flexFlow: 'column',
                          alignItems: 'center',
                        }}
                      >
                        <div
                          style={{
                            textAlign: 'left',
                            border: '0.5px solid #1e272b',
                            padding: '3%',
                            borderRadius: '5%',
                            margin: '2%',
                          }}
                        >
                          <div
                            className=""
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <div
                              style={{
                                fontFamily: 'sans-serif',
                                fontWeight: 'bold',
                                fontSize: '25px',
                                marginTop: '5%',
                                marginBottom: '5%',
                              }}
                            >
                              User{index + 1}
                            </div>
                            {contactData.length > 1 && (
                              <IconButton
                                key={index}
                                onClick={() => removeContacts(index)}
                              >
                                <PersonRemoveIcon
                                  key={index}
                                  style={{
                                    fontSize: '25px',
                                    cursor: 'pointer',
                                    color: '#B1B3B5',
                                  }}
                                />
                              </IconButton>
                            )}
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                            }}
                          >
                            <div
                              className=""
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              Address :{' '}
                              <input
                                style={inputStyle}
                                placeholder="Address"
                                name="address"
                                type="text"
                                value={user.address}
                                onChange={(e) => onChangeContact(e, index)}
                              />
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              Name :{' '}
                              <input
                                style={inputStyle}
                                placeholder="Name"
                                name="name"
                                type="text"
                                value={user.name}
                                onChange={(e) => onChangeContact(e, index)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <ButtonGroup
                  variant="contained"
                  aria-label="small button group"
                  style={{ display: 'flex', justifyContent: 'center' }}
                  disableElevation
                >
                  {contactData.length < 3 ? (
                    <Button className="submitBtn" onClick={addContacts}>
                      {' '}
                      Add User
                    </Button>
                  ) : (
                    <Button
                      disabled
                      className="submitBtn"
                      style={{ backgroundColor: 'grey', border: '1px gray' }}
                    >
                      {' '}
                      Add User
                    </Button>
                  )}

                  <Button
                    className="submitBtn"
                    onClick={() => {
                      addContact();
                    }}
                  >
                    {' '}
                    submit
                  </Button>
                </ButtonGroup>
              </div>
            </Box>
          </Modal>
        </div>
      </div>
      <Divider />
      {!isLoading ? (
        <>
          <div className="Sidebar__search">
            <div className="Sidebar__searchContainer">
              <SearchRounded />
              <input
                placeholder="Search Group"
                type="text"
                value={input}
                onChange={handleChange}
              />
            </div>
          </div>
          <Divider />
          {/* checks the condition  whetjher the room nmae present or not */}
          {sidebarBool ? (
            <div className="Sidebar__chats" style={{ overflowX: 'hidden' }}>
              <Sidebarchat addNewChat="true" />
              {rooms.map((room: any) => (
                <Sidebarchat key={room.id} id={room.id} name={room.name} />
              ))}
            </div>
          ) : (
            <div className="Sidebar__chats">
              <Sidebarchat addNewChat="true" />
              {search.map((room: any) => (
                <Sidebarchat
                  key={room.id}
                  id={room.id}
                  name={room.name}
                  access={access}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="loading">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
