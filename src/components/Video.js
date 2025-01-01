// import React, {useState, useRef, useEffect} from 'react'
// import "../Css/Video.css";
// function Video() {
//     const videoRef = useRef(null);
//     const photoRef = useRef(null);

//     const [ hasPhoto , setHasPhoto] = useState(false);

//     const getVideo = () =>{
//         navigator.mediaDevices.getUserMedia({
//             video: {width: 300 , height: 300}
//         }).then(stream =>{
//             let video = videoRef.current;
//             video.srcObject = stream;
//             video.play();
//         }).catch(err =>{
//             console.error(err);
//         })
//     }

//     const takePhoto = ()=>{
//         let height = 250;
//         let width = 200;

//         let video = videoRef.current;
//         let photo = photoRef.current;

//         photo.width = width;
//         photo.height = height;

//         let ctx = photo.getContext('2d');
//         ctx.drawImage(video,0,0,width,height);
//         setHasPhoto(true);
//     }

//     useEffect(()=>{
//         getVideo();
//     },[videoRef]);
  
//     const close = ()=>{
//         let photo = photoRef.current;
//         let ctx = photo.getContext('2d');
//         ctx.clearRect(0, 0, photo.width, photo.height)
//         setHasPhoto(false);
//     }
//       return (
//     <>
//         <div className='camera'>
//             <video className='video' ref={videoRef}></video>
//             <button className='Takesnap' onClick={takePhoto}>snap</button>
//         </div>
//         <div className={'result' + (hasPhoto ? 'hasPhoto' : "")}>
//           <canvas className={ hasPhoto ? 'canvas' : ""} ref={photoRef}></canvas>
         
//           <button onClick={close} className={hasPhoto ? 'Takesnap1' : ""} > {hasPhoto ? 'close' : null}</button>
//         </div>
//     </>
//   )
// }

// export default Video


// import React, { useRef, useState } from 'react';
// import Peer from 'simple-peer';

// const Video= () => {
//   const [isCallStarted, setIsCallStarted] = useState(false);
//   const [isReceivingCall, setIsReceivingCall] = useState(false);
//   const [peer, setPeer] = useState(null);
//   const [otherPeerId, setOtherPeerId] = useState('');
//   const myStreamRef = useRef(null);
//   const otherStreamRef = useRef(null);
//   const signalingChannel = useRef(null);
//   const myId = useRef(Math.random().toString(36).substring(2, 5)); // Random ID for simplicity

//   const startStream = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//     myStreamRef.current.srcObject = stream;
  
//     // Initialize signaling channel
//     if (!signalingChannel.current) {
//       signalingChannel.current = new BroadcastChannel('webrtc');
//       signalingChannel.current.onmessage = (message) => handleSignal(message.data);
//     }
//   };
  

//   const createPeer = (initiator) => {
//     const newPeer = new Peer({
//       initiator,
//       stream: myStreamRef.current.srcObject,
//       trickle: false, // Disable trickle ICE for simplicity
//     });

//     // Send signaling data via BroadcastChannel
//     newPeer.on('signal', (data) => {
//         if (signalingChannel.current) {
//           signalingChannel.current.postMessage({ data, targetId: otherPeerId, senderId: myId.current });
//         } else {
//           console.error('Signaling channel is not initialized.');
//         }
//       });
      

//     // Receive remote stream
//     newPeer.on('stream', (stream) => {
//       otherStreamRef.current.srcObject = stream;
//     });

//     setPeer(newPeer);
//   };

//   const handleSignal = (message) => {
//     if (message.targetId !== myId.current) return; // Ignore if not the intended recipient

//     if (message.data.type === 'offer') {
//       setIsReceivingCall(true);
//       createPeer(false); // Create peer as a receiver
//       peer.signal(message.data);
//     } else {
//       peer.signal(message.data); // Handle answer or ICE candidates
//     }
//   };

//   const handleStartCall = () => {
//     setIsCallStarted(true);
//     createPeer(true); // Start as initiator
//   };

//   const handleAcceptCall = () => {
//     setIsReceivingCall(false);
//     setIsCallStarted(true);
//     peer.signal(peer.signalQueue?.shift());
//   };

//   return (
//     <div>
//       <h1>Video Call </h1>
//       {/* <h1>Your Id {myId?myId:null}</h1> */}
//       <p>Your Peer ID: {myId.current}</p>


//       <video ref={myStreamRef} autoPlay playsInline muted style={{ width: '45%', marginRight: '10px' }} />
//       <video ref={otherStreamRef} autoPlay playsInline style={{ width: '45%' }} />

//       {!isCallStarted && (
//         <div style={{ marginTop: '20px' }}>
//           <button onClick={startStream}>Start Stream</button>
//           <input
//             type="text"
//             placeholder="Enter Peer ID"
//             value={otherPeerId}
//             onChange={(e) => setOtherPeerId(e.target.value)}
//             style={{ marginLeft: '10px', marginRight: '10px' }}
//           />
//           <button onClick={handleStartCall}>Start Call</button>
//         </div>
//       )}

//       {isReceivingCall && (
//         <div style={{ marginTop: '20px' }}>
//           <p>You are receiving a call!</p>
//           <button onClick={handleAcceptCall}>Accept Call</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Video;


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
  const myId = useRef(Math.random().toString(36).substring(2, 4)); // Random ID

  useEffect(() => {
    // Initialize signaling channel and set up message listener
    signalingChannel.current = new BroadcastChannel('webrtc');

    signalingChannel.current.onmessage = (message) => {
      const { data, targetId, senderId } = message;

      if (targetId !== myId.current) return; // Ignore if not for this peer

      if (data.type === 'offer') {
        // Notify user of incoming call
        setIsReceivingCall(true);

        // Create a peer to answer the call
        const newPeer = new Peer({
          initiator: false,
          stream: myStreamRef.current.srcObject,
          trickle: false,
        });

        // Set up the peer's event listeners
        setUpPeerListeners(newPeer, senderId);
        setPeer(newPeer);

        // Signal the peer with the offer
        newPeer.signal(data);
      } else if (data.type === 'answer') {
        // Handle answer from the remote peer
        peer?.signal(data);
      } else if (data.candidate) {
        // Add ICE candidate
        peer?.signal(data);
      }
    };

    return () => {
      signalingChannel.current?.close(); // Clean up the channel on unmount
    };
  }, [peer]);

  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      myStreamRef.current.srcObject = stream;
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

    // Set up the peer's event listeners
    setUpPeerListeners(newPeer, otherPeerId);
    setPeer(newPeer);
  };

  const setUpPeerListeners = (newPeer, targetId) => {
    // Send signaling data via BroadcastChannel
    newPeer.on('signal', (data) => {
      if (signalingChannel.current) {
        signalingChannel.current.postMessage({ data, targetId, senderId: myId.current });
      }
    });

    // Receive the remote stream
    newPeer.on('stream', (stream) => {
      otherStreamRef.current.srcObject = stream;
    });
  };

  const handleStartCall = () => {
    setIsCallStarted(true);
    createPeer(true); // Start as initiator
  };

  const handleAcceptCall = () => {
    setIsReceivingCall(false);
    setIsCallStarted(true);
  };

  return (
    <div>
      <h1>React Video Call</h1>
      <p>Your Peer ID: {myId.current}</p>
      <video ref={myStreamRef} autoPlay playsInline muted style={{ width: '45%', marginRight: '10px' }} />
      <video ref={otherStreamRef} autoPlay playsInline style={{ width: '45%' }} />

      {!isCallStarted && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={startStream}>Start Stream</button>
          <input
            type="text"
            placeholder="Enter Peer ID"
            value={otherPeerId}
            onChange={(e) => setOtherPeerId(e.target.value)}
            style={{ marginLeft: '10px', marginRight: '10px' }}
          />
          <button onClick={handleStartCall}>Start Call</button>
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
