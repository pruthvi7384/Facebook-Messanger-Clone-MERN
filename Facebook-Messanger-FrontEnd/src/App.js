import React,{ useState, useEffect } from "react";
import FlipMove from 'react-flip-move';
import { FormControl, InputLabel, Input, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from "@material-ui/core";
import TelegramIcon from '@material-ui/icons/Telegram';
import './style.css';
import Message from "./Message";
import LOGO from "./logo.png"
import axios from "axios"
import Pusher from 'pusher-js';

// Pusher
var pusher = new Pusher('ee7a40a30c8c02570180', {
  cluster: 'ap2'
});

function App() {
  // Use State For Store Messagess
  const [messages,setMessages] =useState([]);
  // Use State Initialization for Message Input
  const [input,setInput] = useState('');
  // Use State for user name input
  const [name,setname] = useState('');
  // user name setname
  const [username,setUsername] = useState('');
  
  // For Poupu
  const [open, setOpen] = React.useState(true);

  // For input user Name
  // Get Messsage To database
  const handleClose = () => {
    setUsername(name);
    setOpen(false);
  };

  // Retriew Data From API MERN
  const sync = async() => {
    await axios.get('http://localhost:8000/retrieve/conversation').then((res) => {
      // console.log('results', res.data);
      setMessages(res.data);
    });
  };
  useEffect(()=>{
    sync();
  },[])

  // Channel Set for Pusher Realtime event Listner
  useEffect(() => {
    const channel = pusher.subscribe('messages-channel');
    channel.bind('newMessage', function(data) {
      sync();
    });
  }, [username]);

  console.log(messages)

  // Send Message To Database
  const sendMessage=()=>{
      axios.post('http://localhost:8000/save/messages',{
        username: username,
        message: input,
        timestamp: Date.now()
      })
      setInput('');
  }

  return (
    <div className="container">
      {/* Dialog Box Here for user name parpose */}
      <Dialog open={open} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Enter User Name</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              value={name}
              label="Enter Your Name..."
              type="text"
              fullWidth
              onChange={ev=>setname(ev.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button disabled={!name} onClick={handleClose} color="primary">
                Submit 
            </Button>
          </DialogActions>
      </Dialog>
        <img src={LOGO} alt=""/>
        <h2>Hey, {!username ? 'Unknown User' : username} <br/> Welcome To Facebook Messenger</h2>
        <div className="messages-display">
          <div className="messages-container">
            <FlipMove>
              {
                messages.map(message => (
                  <Message key={message._id} message={message} username={username} />
                ))
              }
            </FlipMove>
          </div>
          <form>
            <FormControl style={{width:'100%'}}>
                <InputLabel >Write Your Message....</InputLabel>
                <Input type="text" value={input} onChange={event=>setInput(event.target.value)} />
                </FormControl>
            <Button disabled={!input} variant="contained" color="primary" onClick={sendMessage} ><TelegramIcon/></Button>
          </form>
        </div>
    </div>
  );
}

export default App;
