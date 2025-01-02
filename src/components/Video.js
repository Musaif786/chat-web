import React, { useRef, useState, useEffect } from 'react';
import Peer from 'simple-peer';

const VideoCall = () => {
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [isReceivingCall, setIsReceivingCall] = useState(false);
  const [peer, setPeer] = useState(null);
  const [otherPeerId, setOtherPeerId] = useState('');
  const myStreamRef = useRef(null);
  const otherStreamRef = useRef(null);
  const signalingChannel = useRef(null);
  const myId = useRef(Math.random().toString(36).substring(2, 5)); // Short Random ID
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isStreamStarted, setIsStreamStarted] = useState(false);

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
    // Initialize signaling channel
    signalingChannel.current = new BroadcastChannel('webrtc');
    console.log(`Signaling channel initialized for ID: ${myId.current}`);

    // Listen for signaling messages
    signalingChannel.current.onmessage = (event) => {
      const { data, targetId, senderId } = event.data;

      if (targetId !== myId.current) return; // Ignore messages not meant for this peer
      console.log('Received signal:', data);

      if (data.type === 'offer') {
        // Notify user of an incoming call
        setIsReceivingCall(true);

        // Create a new peer to answer the call
        const newPeer = new Peer({
          initiator: false,
          stream: myStreamRef.current.srcObject,
          trickle: false,
        });

        setUpPeerListeners(newPeer, senderId);
        setPeer(newPeer);

        // Respond to the offer
        newPeer.signal(data);
      } else if (data.type === 'answer') {
        peer?.signal(data);
      } else if (data.candidate) {
        peer?.signal(data);
      }
    };

    return () => {
      signalingChannel.current?.close(); // Cleanup on component unmount
    };
  }, [peer]);

  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      myStreamRef.current.srcObject = stream;
      setIsStreamStarted(true)

    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const createPeer = (initiator) => {
    const newPeer = new Peer({
      initiator,
      stream: myStreamRef.current.srcObject,
      trickle: false,
    });

    setUpPeerListeners(newPeer, otherPeerId);
    setPeer(newPeer);
  };

  const setUpPeerListeners = (newPeer, targetId) => {
    // Handle signaling
    newPeer.on('signal', (data) => {
      console.log('Sending signal:', data);
      signalingChannel.current?.postMessage({ data, targetId, senderId: myId.current });
    });

    signalingChannel.current.onmessage = (event) => {
      console.log('Received message:', event.data); // Check if this logs when messages are received
    };

    // Handle incoming remote stream
    newPeer.on('stream', (stream) => {
      otherStreamRef.current.srcObject = stream;
    });

    // Debugging
    newPeer.on('connect', () => console.log('Peers connected!'));
    newPeer.on('error', (err) => console.error('Peer error:', err));
  };

  const handleStartCall = () => {
    setIsCallStarted(true);
    createPeer(true); // Act as initiator
  };

  const handleAcceptCall = () => {
    setIsReceivingCall(false);
    setIsCallStarted(true);
  };

  return (
    <div>
      <h1>Video Call</h1>
      <p >Your Video ID: ' {myId.current} '</p>
      {/* <video ref={myStreamRef} autoPlay playsInline muted style={{ width: '45%', marginRight: '10px' }} />
      <video ref={otherStreamRef} autoPlay playsInline style={{ width: '45%' }} /> */}

<video ref={myStreamRef} autoPlay playsInline muted={isMuted} style={{ width: '45%', marginRight: '10px' }} />
      <video ref={otherStreamRef} autoPlay playsInline style={{ width: '45%' }} />
      
      
      {isStreamStarted &&
      <div style={{ marginTop: '20px' }}>
        <button className='btn' onClick={toggleMute}>{isMuted ? 'Unmute' : 'Mute'}</button>
        <button className='btn' onClick={toggleVideo}>{isVideoOff ? 'Turn Video On' : 'Turn Video Off'}</button>
      </div>
}


      {!isCallStarted && (
        <div style={{ marginTop: '20px' }}>
          <button className='btn' onClick={startStream}>Start Stream</button>
          <input
            type="text"
            placeholder="Enter Peer ID"
            value={otherPeerId}
            onChange={(e) => setOtherPeerId(e.target.value)}
            style={{ marginLeft: '10px', marginRight: '10px' }}
          />
          <button className='btn' onClick={handleStartCall}>Start Call</button>
        </div>
      )}

      {isReceivingCall && (
        <div style={{ marginTop: '20px' }}>
          <p>You are receiving a call!</p>
          <button onClick={handleAcceptCall}>Accept Call</button>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
