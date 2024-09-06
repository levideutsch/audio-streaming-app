import React, { useEffect, useRef, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import Peer from 'simple-peer';
import { UserContext } from '../context/User';
import AudioVisualizer from './AudioVisualizer';
import { Button } from '@mui/material';


function UserPage() {
  const { userId } = useParams();
  const { users, setUsers } = useContext(UserContext);

  const userAudioRef = useRef();
  const otherUserAudioRef = useRef();
  const peerRef = useRef();
  const [isUserMuted, setIsUserMuted] = useState(false);
  const [isOtherUserMuted, setIsOtherUserMuted] = useState(false);
  const [filterEnabled, setFilterEnabled] = useState(false);

  console.log("me", isUserMuted)
  console.log("other", isOtherUserMuted)

  useEffect(() => {
    const currentUserId = parseInt(userId, 10);

    // Function to start streaming for a user
    const startUserStreaming = (userId) => {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          setUsers(prevUsers =>
            prevUsers.map(user =>
              user.id === userId ? { ...user, stream } : user
            )
          );

          if (userId === currentUserId && userAudioRef.current) {
            userAudioRef.current.srcObject = stream;
          } else if (userId !== currentUserId && otherUserAudioRef.current) {
            otherUserAudioRef.current.srcObject = stream;
          }
        });
    };

    // Start streaming for both users if current user is 1
    if (currentUserId === 1) {
      startUserStreaming(1);
      startUserStreaming(2);
    }

    return () => {
      // Clean up tracks
      [userAudioRef.current, otherUserAudioRef.current].forEach(ref => {
        if (ref && ref.srcObject) {
          const tracks = ref.srcObject.getTracks();
          tracks.forEach(track => track.stop());
        }
      });
    };
  }, [userId, setUsers]);

  useEffect(() => {
    if (userAudioRef.current) {
      const audioTracks = userAudioRef.current.srcObject?.getAudioTracks();
      if (audioTracks) {
        audioTracks.forEach(track => track.enabled = !isUserMuted);
      }
    }
    if (otherUserAudioRef.current) {
      const audioTracks = otherUserAudioRef.current.srcObject?.getAudioTracks();
      if (audioTracks) {
        audioTracks.forEach(track => track.enabled = !isOtherUserMuted);
      }
    }
  }, [isUserMuted, isOtherUserMuted]);

  const startStreaming = () => {
    const otherUserId = userId === '1' ? 2 : 1;
    const currentUserStream = users.find(user => user.id === parseInt(userId))?.stream;
    const otherUserStream = users.find(user => user.id === otherUserId)?.stream;

    if (!currentUserStream || !otherUserStream) {
      console.error('Streams not available yet!');
      return;
    }

    peerRef.current = new Peer({ initiator: userId === '1', stream: currentUserStream });

    peerRef.current.on('signal', data => {
      const otherPeer = new Peer();
      otherPeer.signal(data);
    });

    peerRef.current.on('stream', stream => {
      if (otherUserAudioRef.current) {
        otherUserAudioRef.current.srcObject = stream;
      }
    });
  };

  const toggleFilter = () => {
    setFilterEnabled(!filterEnabled);
  };

  return (
    <div style={{ textAlign: 'center', height: '100vh' }}>
      <h1 style={{ color: 'white' }}>User {userId}</h1>
      <audio ref={userAudioRef} controls autoPlay style={{ margin: '20px', color: 'white' }} />
      <audio ref={otherUserAudioRef} controls autoPlay style={{ margin: '20px', color: 'white' }} />
      {/* <AudioVisualizer stream={users.find(user => user.id === parseInt(userId))?.stream} /> */}
      <p style={{ color: 'white' }}>Stream coming from user {userId === '1' ? '2' : '1'}</p>
      <Button onClick={() => setIsUserMuted(!isUserMuted)} style={{ marginTop: '20px' }}>
        {isUserMuted ? 'Unmute Me' : 'Mute Me'}
      </Button>
      <Button onClick={() => setIsOtherUserMuted(!isOtherUserMuted)} style={{ marginTop: '20px' }}>
        {isOtherUserMuted ? 'Unmute Other User' : 'Mute Other User'}
      </Button>
      <Button onClick={toggleFilter} style={{ marginTop: '20px' }}>
        {filterEnabled ? 'Disable Filter' : 'Enable Filter'}
      </Button>
      <Button onClick={startStreaming} style={{ marginTop: '20px' }}>
        Start Streaming
      </Button>
<br />
      <AudioVisualizer stream={users.find(user => user.id === parseInt(userId))?.stream} />
    </div>
  );
}

export default UserPage;









