"use client";
import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { io } from "socket.io-client";
function Chat({ id }) {
  const [messages, setMessages] = useState([]);
  const token = Cookies.get("userid");
  const [text, setText] = useState("");
  const [chatroomInfo, setChatroomInfo] = useState({});
  const getMessages = async () => {
    const res = await fetch(`https://chat-backend-vds6.onrender.com/chatroom/${id}`);
    const data = await res.json();
    setChatroomInfo(data.chatroom);
    setMessages(data.chatroom.messages);
  };
  useEffect(() => {
    getMessages();
  }, []);
  const socket = useRef(null);
  useEffect(() => {
    socket.current = io("https://chat-backend-vds6.onrender.com");
    socket.current.on("message", (message) => {
      setMessages((prev) => [...prev, message]);
    });
    socket.current.on("room", (message) => {
      setChatroomInfo(message.chatroom);
      console.log({ message });

      setMessages(message.chatroom.messages);
    });
    return () => {
      socket.current.disconnect();
    };
  }, []);
  const sendmessage = async (e) => {
    e.preventDefault();
    const dd = socket.current.emit("chatMessage", {
      text,
      token: localStorage.getItem("userid"),
      id,
    });

    // const res = await fetch(`https://chat-backend-vds6.onrender.com/chatroom/${id}`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ message:text, userid: token }),
    // });
    // const data = await res.json();
    // console.log({ data });
    // setMessages([data.chatroom.messages]);
  };
  const leftRoom = async (e) => {
    e.preventDefault();
    socket.current.emit("leftChat", { username: 38, roomid: id });
  };
  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>
          <i className="fas fa-smile" /> چت یاد{" "}
        </h1>
        <button onClick={leftRoom} className="btn">
          {" "}
          ترک اتاق
        </button>
      </header>
      <main className="chat-main">
        <div className="chat-sidebar">
          <h3>
            <i className="fas fa-comments" /> نام اتاق :
          </h3>
          <h2 id="room-name">{chatroomInfo.name}</h2>
          <h3>
            <i className="fas fa-users" /> اعضا
          </h3>
          <ul id="users">
            {chatroomInfo?.members?.map((user, index) => (
              <li key={index + 1}>{user.username}</li>
            ))}
          </ul>
        </div>
        <div className="chat-messages">
          {messages?.map((message, index) => (
            <div className="message" key={index + 1}>
              <div style={{ display: "flex" }}>
                <span className="meta">
                  {message?.user || message?.sender?.username}
                </span>
                <span>{"  -  "}</span>
                <span>
                  {new Date(
                    message?.time ? message.time : message?.createdAt,
                  ).toLocaleDateString("fa-IR")}
                </span>
                {"  "}
              </div>
              <p className="text">{message?.message}</p>
            </div>
          ))}
        </div>
      </main>
      <div className="chat-form-container">
        <form>
          <input
            id="msg"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="پیام خود را بنویسید"
            required=""
            autoComplete="off"
          />
          <button className="btn" onClick={sendmessage}>
            <i className="fas fa-paper-plane" /> ارسال
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
