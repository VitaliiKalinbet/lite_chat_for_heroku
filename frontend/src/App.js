import React, { Component } from 'react';
import './App.css';
import Chat from './Chat/Chat';
import Login from './Auth/Login';
import Registration from './Auth/Registration';
import socket from "socket.io-client";
import moment from 'moment'
import UserPanel from './UserPanel/UserPanel';

window.socket = socket(window.location.origin, {
    path: "/chat/"
}, {transports: ['websocket']});

class App extends Component {
  
  state = {
    modal: true,
    modalRegistration: false,
    user: '',
    error: '',
    online: 0,
    messages: [],
    usersOnline: [],
    password: '',
    confirmPassword: '',
    email: '',
    currentUser: {},
  }

  handlerChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  toggleModal = () => {
      this.setState(prev => ({
        modal: false,
      }))
   }

  anotherModal = () => {
    this.setState(prev => ({
      modal: !prev.modal,
      modalRegistration: !prev.modalRegistration,
      user: '',
      password: '',
      confirmPassword: '',
      email: '',
    }))
}

  funcRegistration = () => {
    let obj = {
      username: this.state.user,
      password: this.state.password,
      email: this.state.email,
    }
    window.socket.emit('register', obj)
  }

  funcLogin = () => {
      let obj = {
        username: this.state.user,
        password: this.state.password,
        email: this.state.email,
      }
      window.socket.emit('login', obj)
  }

  componentWillMount(){ 
    window.socket.on("all-messages", (obj) => {
      // console.log(window.socket.channel);
      // console.log('aaaaaaaaaaaaaa2')
        this.setState({
            messages: obj.docs,
            online: obj.online,
            usersOnline: [...obj.usersOnline],
            userId: obj.clientId,
        })
    })

    let user = {
      data: 'succsess',
    }
    window.socket.emit('new-user', user)
    // console.log('aaaaaaaaaaaaaa1')
  }

  componentDidMount() {
    window.socket.on('register-on-DB', (message) => {
      console.log('register-on-DB', message);
      if (message.currentUser) {
        this.setState({
          currentUser: message.currentUser,
          user: message.currentUser.username,
          modal: false,
          modalRegistration: false,
        })
      } else {
        this.setState({
          error: message.message,
        })
      }
    });

    window.socket.on('login-done', (message) => {
      console.log('login-done', message);
      if (message.currentUser) {
        this.setState({
          currentUser: message.currentUser,
          user: message.currentUser.username,
          modal: false,
          modalRegistration: false,
        })
      } else {
        this.setState({
          error: message.message,
        })
      }
    });

    window.socket.on("change-online", (online) => {
      this.setState({
          online: online,
        })
    })
    window.socket.on("get-user-name", (usersOnline) => {
      this.setState({
        usersOnline: [...usersOnline]
      })
    })
  }

  componentWillUnmount(){
    let user = {
      data: 'succsess',
    }
    window.socket.emit('disconnect', (user))
  }

  // uniqueNames=(arr)=> {
  //   // let  obj = {};
  //   //   for (let i = 0; i < arr.length; i++) {
  //   //   let str = arr[i].author;
  //   //   obj[str] = true; // запомнить строку в виде свойства объекта
  //   // }
  //   // let result = [...Object.keys(obj)];
  //   // if (!result.includes(this.state.user)) {
  //   //   result.push(this.state.user)
  //   // }
  //   this.setState(prev =>({
  //     users: [...prev.users, this.state.user],
  //   }))
  // }
  
  render() {
     const {modal, modalRegistration, online, messages, usersOnline} = this.state
    return (
  
      <div className="App">
        {modal && !modalRegistration ? <Login email={this.state.email} funcLogin={this.funcLogin} anotherModal={this.anotherModal} closeModal={this.onClick} user={this.state.user} handlerChange={this.handlerChange} 
        error={this.state.error} password={this.state.password}/> 
        : !modal && modalRegistration ? <Registration error={this.state.error} email={this.state.email} funcRegistration={this.funcRegistration} anotherModal={this.anotherModal} confirmPassword={this.state.confirmPassword} handlerChange={this.handlerChange} user={this.state.user} password={this.state.password}/> :
        <div className='chatWrapper'>
          <UserPanel users={usersOnline} user={this.state.user}/><Chat user={this.state.user} online={this.state.online} messages={this.state.messages}/> </div>}
      </div>
    );
  }
}

export default App;
