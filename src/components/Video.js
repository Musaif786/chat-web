import React, { useRef, useState, useEffect } from 'react';
import Peer from 'simple-peer';
import { db } from "../firebase"; // Ensure correct Firebase config
import { collection, doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";

const VideoCall = () => {
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [isReceivingCall, setIsReceivingCall] = useState(false);
  const [peer, setPeer] = useState(null);
  const [otherPeerId, setOtherPeerId] = useState('');
  const myStreamRef = useRef(null);
  const otherStreamRef = useRef(null);
  const myId = useRef(Math.random().toString(36).substring(2, 5).toLowerCase()); // Short Random ID
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isStreamStarted, setIsStreamStarted] = useState(false);
  const [incomingOffer, setIncomingOffer] = useState(null); 
  const signalingCollection = collection(db, "signaling"); // Firestore collection for signaling

  const toggleMute = () => {
    if (myStreamRef.current && myStreamRef.current.srcObject) {
      const audioTracks = myStreamRef.current.srcObject.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = !isMuted;
        setIsMuted(!isMuted);
      }
    }
  };

  const toggleVideo = () => {
    if (myStreamRef.current && myStreamRef.current.srcObject) {
      const videoTracks = myStreamRef.current.srcObject.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks[0].enabled = !isVideoOff;
        setIsVideoOff(!isVideoOff);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(signalingCollection, myId.current), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const { senderId, data } = docSnapshot.data();

        if (data.type === 'offer') {
          handleIncomingOffer({ senderId, data });
        } else if (data.type === 'answer' || data.candidate) {
          peer?.signal(data);
        }
      }
    });

    return () => unsubscribe();
  }, [peer]);

  const handleIncomingOffer = ({ senderId, data }) => {
    setIsReceivingCall(true);
    setIncomingOffer({ senderId, data });

    const newPeer = new Peer({
      initiator: false,
      stream: myStreamRef.current?.srcObject,
      trickle: false,
      config: { iceServers: [{ urls: ['stun:stun.l.google.com:19302', 'stun:global.stun.twilio.com:3478'] }] },
    });

    setUpPeerListeners(newPeer, senderId);
    setPeer(newPeer);
    newPeer.signal(data);
  };

  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      myStreamRef.current.srcObject = stream;
      setIsStreamStarted(true);
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const createPeer = (initiator) => {
    if (peer) return;

    const newPeer = new Peer({
      initiator,
      stream: myStreamRef.current?.srcObject,
      trickle: false,
      config: { iceServers: [{ urls: ['stun:stun.l.google.com:19302', 'stun:global.stun.twilio.com:3478'] }] },
    });

    setUpPeerListeners(newPeer, otherPeerId);
    setPeer(newPeer);
  };

  const sendSignal = async (data, targetId) => {
    const signalingDoc = doc(signalingCollection, targetId);
    await setDoc(signalingDoc, { senderId: myId.current, data });
    await updateDoc(signalingDoc, { data: null });
  };

  const endCall = async () => {
    peer?.destroy();
    setPeer(null);
    setIsCallStarted(false);
    setIsReceivingCall(false);
    await updateDoc(doc(signalingCollection, myId.current), { data: null });
  };

  const setUpPeerListeners = (newPeer, targetId) => {
    newPeer.on('signal', (data) => sendSignal(data, targetId));
    newPeer.on('stream', (stream) => {
      if (otherStreamRef.current) {
        otherStreamRef.current.srcObject = stream;
      }
    });
    newPeer.on('connect', () => console.log('Peers connected!'));
    newPeer.on('error', (err) => console.error('Peer error:', err));
  };

  const handleStartCall = () => {
    setIsCallStarted(true);
    createPeer(true);
  };

  const handleAcceptCall = () => {
    if (!incomingOffer) return; // Ensure there is an offer to process
  
    const { senderId, data } = incomingOffer;
  
    // const newPeer = new Peer({
    //   initiator: false,
    //   stream: myStreamRef.current?.srcObject,
    //   trickle: false,
    //   config: {
    //     iceServers: [
    //       { urls: ['stun:stun.l.google.com:19302', 'stun:global.stun.twilio.com:3478'] },
    //     ],
    //   },
    // });
  
    // setUpPeerListeners(newPeer, senderId);
    // setPeer(newPeer);
  
    // newPeer.signal(data); // Signal the stored offer
  
    setIsReceivingCall(false); // Clear the receiving state
    setIncomingOffer(null); // Clear the stored offer
    setIsCallStarted(true); // Mark call as started
  };

  return (
    <div>
      <h1>Video Call</h1>
      <p>Your Video ID: {myId.current}</p>
      <video ref={myStreamRef} autoPlay playsInline muted style={{ width: '45%', marginRight: '5px' }} />
      <video ref={otherStreamRef} autoPlay playsInline style={{ width: '45%' }} />

      {isStreamStarted && (
        <div style={{ marginTop: '20px' }}>
          <button className='btn' onClick={toggleMute}>{isMuted ? 'Unmute' : 'Mute'}</button>
          <button className='btn' onClick={toggleVideo}>{isVideoOff ? 'Turn Video On' : 'Turn Video Off'}</button>
        </div>
      )}

      {!isCallStarted && (
        <div style={{ marginTop: '20px' }}>
          <button className='btn' onClick={startStream}>Start Stream</button>
          <input
            type="text"
            placeholder="Enter Peer ID"
            value={otherPeerId}
            onChange={(e) => setOtherPeerId(e.target.value)}
            style={{
              marginLeft: '10px',
              marginRight: '10px',
              maxWidth: '40%',
              height: '30px',
              borderRadius: '6px',
              border: '1px solid green',
            }}
          />
          <button className='btn' onClick={handleStartCall}>Start Call</button>
        </div>
      )}

      {isReceivingCall && (
        <div style={{ marginTop: '20px' }}>
          <p>You are receiving a call!</p>
          <button className='btn' onClick={handleAcceptCall}>Accept Call</button>
        </div>
      )}

      {isCallStarted && (
        <div style={{ marginTop: '20px' }}>
          <button className='btn' onClick={endCall}>End Call</button>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
