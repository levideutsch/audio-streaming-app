// REACT IMPORTS
import React, { useState, useEffect, useRef, useContext } from "react";
import { UserContext } from "../context/User";
import { Routes, Route, Link } from "react-router-dom";


// STREAMING IMPORTS
import Peer from "simple-peer";

// MUI IMPORTS
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Input,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

function Home() {
  const { users, setUsers } = useContext(UserContext);

  const buttonStyle = {
    // width: isMobile ? "100%" : "60%",
    // padding: "5px",
    // borderRadius: "8px",
    // boxShadow: 20,
    backgroundColor: "white",
    color: "black",
    textAlign: "center",
    margin: "0 auto",
    // height: isMobile ? "28vh" : "35vh",
    overflow: "auto",
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    margin: "5px"
  };

const hoverStyle = {
    transform: 'scale(1.55)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
}; 

//   const user1Ref = useRef();
//   const user2Ref = useRef();

//   const peer1 = useRef();
//   const peer2 = useRef();

//   useEffect(() => {
//     // Request microphone access for both users
//     navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
//       setUsers((users) =>
//         users.map((user) => {
//           if (user.id === 1) {
//             return { ...user, stream };
//           }
//           return user;
//         })
//       );
//       user1Ref.current.srcObject = stream;
//     });

//     navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
//       setUsers((users) =>
//         users.map((user) => {
//           if (user.id === 2) {
//             return { ...user, stream };
//           }
//           return user;
//         })
//       );
//       user2Ref.current.srcObject = stream;
//     });
//   }, []);

//   const startStreaming = () => {
//     // Create peers for both users and connect them
//     peer1.current = new Peer({ initiator: true, stream: users[0].stream });
//     peer2.current = new Peer();

//     // When peer1 sends a signal, peer2 receives it
//     peer1.current.on("signal", (data) => {
//       peer2.current.signal(data);
//     });

//     // When peer2 sends a signal, peer1 receives it
//     peer2.current.on("signal", (data) => {
//       peer1.current.signal(data);
//     });

//     // When peer2 receives the stream, play it for user1
//     peer2.current.on("stream", (stream) => {
//       user1Ref.current.srcObject = stream;
//     });

//     // When peer1 receives the stream, play it for user2
//     peer1.current.on("stream", (stream) => {
//       user2Ref.current.srcObject = stream;
//     });
//   };

  return (
    <div style={{ textAlign: "center"}}>
    <div style={{ textAlign: "center"}}>
      <h1 >Choose a User to Start Streaming</h1>
      {users?.map((user) => (
        <Link key={user?.id} to={`/user/${user?.id}`}>
        <Button 
        variant="contained"
        sx={buttonStyle}
        onMouseOver={(e) => e.currentTarget.style.transform = hoverStyle.transform}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >{user?.name}</Button>
        </Link>
      ))}
    </div>
    </div>
  );
}
export default Home;
