import React,{  Component } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button, TextField } from '@material-ui/core';
import { auth } from "../services/firebase";
import { db, database } from "../services/firebase";
import firebase from 'firebase';
import BoardListItem from "../components/BoardComponent"


export default class BoardChat extends Component {
    constructor(props) {
        super(props);
        this.state = {
          user: auth().currentUser,
          board: '',
          chats:[],
          newMessage:'',
          readError: null,
          writeError: null,
          loadingPosts: false,
          userRole:null,
          boardUid:""
        
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);   
        this.myRef = React.createRef();
      }

      async componentDidMount() {
        // auth().onAuthStateChanged(function(u) {
        //   console.log(u);
        //         console.log(u );
        //     });
        this.setState({ readError: null, loadingChats: true });
        const chatArea = this.myRef.current;
        
        // var docRef = db.collection("Users").doc(this.state.user.uid);
    
        // docRef.get().then((doc) => {
        // if (doc.exists) {
        //     this.setState({userRole: doc.data().UserRole});
        // } else {
        //     // doc.data() will be undefined in this case
        //     console.log("No such document!");
        // }
        // }).catch((error) => {
        // console.log("Error getting document:", error);
        // });
    
        try {
          console.log(this.props.location.state.board_uid);
          database.ref("Chats").child(this.props.location.state.board_uid).child("Messages").on("value", snapshot => {
            let chats = [];
            snapshot.forEach((snap) => {
              chats.push(snap.val());
            });
            this.setState({ chats });
            this.setState({ loadingChats: false });
          });
        } catch (error) {
          this.setState({ readError: error.message, loadingChats: false });
        }
      }
      
      async handleSubmit(event) {
        event.preventDefault();
        console.log(this.state.message);
        this.setState({ writeError: null });
        
        // const chatArea = this.myRef.current;
        try {
          if (this.state.message === ""){
            throw ("Message Cannot be empty")
          }
          await database.ref("Chats").child(this.props.location.state.board_uid).child("Messages").push({
            message: this.state.newMessage,
            timestamp: Date.now(),
            senderID: this.state.user.uid,
            senderUserName:this.state.user.email.split("@")[0]
          });
          this.setState({ newMessage: '' });
          console.log("Message sent successfully");
          // chatArea.scrollBy(0, chatArea.scrollHeight);
        } catch (error) {
          console.log(error.message);
          this.setState({ writeError: error.message });
        }
        this.setState({message: '' });
      }
    
      handleChange(event) {
        this.setState({
          newMessage: event.target.value
        });
        
      }
    
    
      formatTime(timestamp) {
        const d = new Date(timestamp);
        const time = `${d.getDate()}/${(d.getMonth()+1)}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
        return time;
      }
     


  
        render() {
          // const { data } = this.props.location
          
            return (
              
              <div id = "board-page">
                <div id="board-card">
                <Header />
                <div>
                 
                 {/* {    
                this.state.boards.map(board => {
                    return (
                        <BoardListItem board={board.BoardName} boardImg={board.BoardImage} />
                    )
                })
                } */}
                </div>
        
                <h2>{this.props.location.state.board_name} Board Messages</h2>
                <div>
                <div className="chat-area form-element-chatarea" ref={this.myRef}>
           
                  {this.state.loadingChats ? <div className="spinner-border text-success" role="status">
                    <span className="sr-only">Loading...</span>
                  </div> : ""}
                  
                  {this.state.chats.map(chat => {

                    return <p key={chat.timestamp} className={"chat-bubble " + (this.state.user.uid === chat.senderID ? "current-user" : "")}>
                    {chat.message}
                    <br />
                    <span className="chat-time float-right">{this.formatTime(chat.timestamp)} - {chat.senderUserName}</span>
                    </p>

                    // return <h1> post={chat.message} author={chat.senderUserName} timestamp={chat.timestamp}
                    // <br/>
                    // </h1>

                  })}
                </div>
                </div>
                <br></br> 
        
                
                {/* if (db.collection("Users").doc(auth().currentUser.uid.UserRole.localeCompare("Admin") === 0)) {
                  classes.push("admin-user")
                }
                else {
                classes.push("customer-user")
                } */}
        
               
                <hr></hr>
                <form onSubmit={this.handleSubmit}>
                  <TextField  className="form-element input-field" label="Type a Message... " name="newMessage" onChange={this.handleChange} value={this.state.newMessage}></ TextField >
                  {this.state.error ? <p className="text-danger">{this.state.error}</p> : null}
                  <Button variant="contained" type="submit" className="btn btn-submit">Send </Button>
                </form>
                <hr></hr>
        
               
        
        
              <Footer></Footer>
              </div>
              </div>
              
             
            );
          }
        }