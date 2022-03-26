import React, { useRef, useEffect } from "react";
import Moment from "react-moment";

const Message = ({ msg, user1 }) => {
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);
  return (
    <div
      className={`message_wrapper ${msg.from === user1 ? "own" : ""}`}
      ref={scrollRef}
    >
      <p className={msg.from === user1 ? "me" : "friend"}>
        {msg.media ? <img style={{maxHeigt:"200px", maxWidth:"200px"}} src={msg.media} alt={msg.text} /> : null}
        {/* {msg.text} */}
        
        {msg.text && msg.text.charAt(5) == ":" ? (<a className="msg-link" href={ msg.text } target="_blank">[ link... ]</a>): msg.text }
        <br />
        <small>
          <Moment fromNow>{msg.createdAt.toDate()}</Moment>
        
          </small>
      </p>
    </div>
  );
};

export default Message;
