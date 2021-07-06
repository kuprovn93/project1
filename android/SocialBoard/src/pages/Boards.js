import React,{  Component } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button, TextField } from '@material-ui/core';
import { auth } from "../services/firebase";
import { db } from "../services/firebase";
import firebase from 'firebase';
import BoardListItem from "../components/BoardComponent"



export default class Boards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: auth().currentUser,
      boardClicked: '',
      boardlist:[],
      readError: null,
      writeError: null,
      loadingChats: false,
      userRole:null,
      newboard:''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);   
    this.myRef = React.createRef();
  }

  
  async componentDidMount() {
    // auth().onAuthStateChanged(function(u) {
    //   console.log(u);
		// 	if (u) {
				
		// 	console.log(u );
		// 	} else {
		// 		this.setState({ user: null });
		// 	}
			
		// });
    this.setState({ readError: null, loadingChats: true });
    const chatArea = this.myRef.current;
    var docRef = db.collection("Users").doc(this.state.user.uid);

    docRef.get().then((doc) => {
    if (doc.exists) {
        this.setState({userRole: doc.data().UserRole});
        console.log(this.state.userRole)
    } else {
        console.log("No such document!");
    }
    }).catch((error) => {
    console.log("Error getting document:", error);
    });

    try {
      db.collection("Boards").onSnapshot( snapshot => {

        let boards = [];
        snapshot.forEach((snap) => {
          boards.push(snap.data());
        });
        console.log(boards);
        // posts.sort(function (a, b) { return b.CreatedAt - a.CreatedAt })
        this.setState({ boardlist:boards });
        // chatArea.scrollBy(0, chatArea.scrollHeight);
        // this.setState({ loadingChats: false });
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
      if (this.state.newboard === ""){
        throw ("Board Name Cannot be empty")
      }
      db.collection("Boards").add({
        boardImage: "set url manually",
        boardName: this.state.newboard,
        boardUid: ''
      });
      console.log("Board Created successfully");
      // chatArea.scrollBy(0, chatArea.scrollHeight);
    } catch (error) {
      console.log(error.message);
      this.setState({ writeError: error.message });
    }
    this.setState({newboard: '' });
  }

  handleChange(event) {
    this.setState({
      newboard: event.target.value
    });
    
  }


  async formatTime(timestamp) {
    const d = new Date(timestamp);
    const time = `${d.getDate()}/${(d.getMonth()+1)}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
    return time;
  }

  render() {
    return (
      
      <div id = "board-page">
        <div id="board-card">
        
        <Header />
        
        <div id = "board-list">
         {    
        this.state.boardlist.map((board, index) => {
            return (
             
                <BoardListItem key={board.boardUid} id={index} board_uid={board.boardUid} board_name={board.boardName} boardImg={board.boardImage} />
          
            )
        })
        }
        </div>
{/* 
        <h1>Your FanApp Page </h1>
        <div>
        <div className="chat-area form-element" ref={this.myRef}>
   
          {this.state.loadingChats ? <div className="spinner-border text-success" role="status">
            <span className="sr-only">Loading...</span>
          </div> : ""}
          
          {this.state.posts.map(chat => {
            return <PostListItem post={chat.PostData} author={chat.Author} timestamp={chat.CreatedAt.seconds}>
            <br/>
            </PostListItem>
          })}
        </div>
        </div>
        <br></br> */}

        
        {/* if (db.collection("Users").doc(auth().currentUser.uid.UserRole.localeCompare("Admin") === 0)) {
          classes.push("admin-user")
        }
        else {
        classes.push("customer-user")
        } */}

       
        
        <form onSubmit={this.handleSubmit} className={this.state.userRole === "Customer" ? "customer-user": "admin-user"}>
          <TextField  className="form-element  input-field" label="Enter Board Name..." name="newboard" onChange={this.handleChange} value={this.state.newboard}></ TextField >
          {this.state.error ? <p className="text-danger">{this.state.error}</p> : null}
          <Button variant="contained" type="submit" className="btn btn-submit px-5 mt-4">Create </Button>
        </form>

       


      <Footer></Footer>
      </div>
      </div>
      
     
    );
  }
}