import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import AssignmentIcon from "@material-ui/icons/Assignment";
import PhoneIcon from "@material-ui/icons/Phone";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Peer from "simple-peer";
import io from "socket.io-client";
import { memo } from "react";

const socket = io.connect("http://localhost:5000");
export default function Video({
  contacts,
  currentUser, ////my data
  currentChat, // second person datad
  currentMe,
}) {
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        myVideo.current.srcObject = stream;
      });

    socket.on("me", (id) => {
      setMe(id);
    });

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, []);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };

  return (
    <VideoBox>
      <div className="container">
        <div className="video-container">
          <div className="video">
            {stream && <video playsInline ummuted ref={myVideo} autoPlay />}
          </div>
          <div className="video2">
            {callAccepted && !callEnded ? (
              <video playsInline ummuted unmref={userVideo} autoPlay />
            ) : null}
          </div>
        </div>
        <div className="myId">
          <TextField
            id="filled-basic"
            label="Name"
            variant="filled"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginBottom: "20px" }}
          />
          <CopyToClipboard text={me} className="button">
            <IconButton color="primary">
              <AssignmentIcon fontSize="large" />
            </IconButton>
          </CopyToClipboard>

          <TextField
            id="filled-basic"
            label="ID to call"
            variant="filled"
            value={idToCall}
            onChange={(e) => setIdToCall(e.target.value)}
          />
          <div className="call-button">
            {callAccepted && !callEnded ? (
              <Button variant="contained" color="secondary" onClick={leaveCall}>
                End Call
              </Button>
            ) : (
              <IconButton
                color="primary"
                aria-label="call"
                onClick={() => callUser(idToCall)}
              >
                <PhoneIcon fontSize="large" />
              </IconButton>
            )}
            {idToCall}
          </div>
        </div>
        <div>
          {receivingCall && !callAccepted ? (
            <div className="caller">
              <h1>{name} is calling...</h1>
              <Button variant="contained" color="primary" onClick={answerCall}>
                Answer
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </VideoBox>
  );
}

const VideoBox = styled.button`
  background-color: #ffffff;
  display: grid;
  justify-content: center;
  width: 100%;
  .container {
    -webkit-backdrop-filter: blur(149.14px) brightness(100%);
    backdrop-filter: blur(149.14px) brightness(100%);
    background-color: #ffffff1a;
    border-radius: 33.34px;
    box-shadow: var(--vision);
    height: 485px;
    left: 350px;
    overflow: hidden;
    position: absolute;
    top: 65px;
    max-width: 930px;

    overflow: hidden;
  }
  .video-container {
    display: flex;
    flex-direction: row;
    left: 20px;
    position: absolute;
    top: 23px;
    width: 500px;
  }
  video {
    border: 3px solid white;
    border-radius: 0.5rem;
    width: 400px;
    height: 300px;
  }
  .video2 {
    border: 3px solid white;
    border-radius: 0.5rem;
    width: 400px;
    height: 300px;
  }
  .myId {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    width: 500px;
    padding: 0.5rem;
    height: 150px;
    margin-top: 350px;
    margin-left: 250px;
  }
  .button {
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 0.5rem;
    background-color: #9a86f3;
    border: none;
    cursor: pointer;
    svg {
      font-size: 1.3rem;
      color: #ebe7ff;
    }
    &:hover {
      background-color: #9a86f3;
    }
  }
  .call-button {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    border-radius: 0.5rem;
    background-color: #9a86f3;
    border: none;
    cursor: pointer;
    svg {
      font-size: 1.3rem;
      color: #ebe7ff;
    }
  }
`;
