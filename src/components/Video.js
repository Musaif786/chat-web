import React, {useState, useRef, useEffect} from 'react'
import "../Css/Video.css";
function Video() {
    const videoRef = useRef(null);
    const photoRef = useRef(null);

    const [ hasPhoto , setHasPhoto] = useState(false);

    const getVideo = () =>{
        navigator.mediaDevices.getUserMedia({
            video: {width: 320 , height: 450}
        }).then(stream =>{
            let video = videoRef.current;
            video.srcObject = stream;
            video.play();
        }).catch(err =>{
            console.error(err);
        })
    }

    const takePhoto = ()=>{
        let height = 300;
        let width = 250;

        let video = videoRef.current;
        let photo = photoRef.current;

        photo.width = width;
        photo.height = height;

        let ctx = photo.getContext('2d');
        ctx.drawImage(video,0,0,width,height);
        setHasPhoto(true);
    }

    useEffect(()=>{
        getVideo();
    },[videoRef]);
  
    const close = ()=>{
        let photo = photoRef.current;
        let ctx = photo.getContext('2d');
        ctx.clearRect(0, 0, photo.width, photo.height)
        setHasPhoto(false);
    }
      return (
    <>
        <div className='camera'>
            <video ref={videoRef}></video>
            <button className='Takesnap' onClick={takePhoto}>snap</button>
        </div>
        <div className={'result' + (hasPhoto ? 'hasPhoto' : "")}>
          <canvas ref={photoRef}></canvas>
          <button onClick={close} className={hasPhoto ? 'Takesnap1' : ""} > {hasPhoto ? 'close' : null}</button>
        </div>
    </>
  )
}

export default Video