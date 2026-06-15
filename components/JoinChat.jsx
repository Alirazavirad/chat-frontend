"use client";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

function JoinChat() {
  const router = useRouter();
  const socket = useRef(null);
  const token = Cookies.get("userid");

  useEffect(() => {
    socket.current = io("https://chat-backend-vds6.onrender.com");
    return () => {
      socket.current.disconnect();
    };
  }, []);
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    socket.current.emit("joinChat", { username: name, roomname: room });
    socket.current.on("room", (message) => {
      console.log({message});
      localStorage.setItem("userid", message.user);
      router.push(`/chat/${message.chatroom.id}`);
    });

  };
  return (
    <div className="join-container">
      <header className="join-header">
        <h1>
          <i className="fas fa-smile" /> ChatYad
        </h1>
      </header>
      <main className="join-main">
        <form>
          <div className="form-control">
            <label htmlFor="username">نام کاربری</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="نام کاربری را وارد کنید..."
              required=""
            />
          </div>
          <div className="form-control">
            <label htmlFor="room">روم</label>
            <select value={room} onChange={(e) => setRoom(e.target.value)}>
              <option value="">انتخاب روم</option>
              <option value="JavaScript">جاوااسکریپت</option>
              <option value="Python">پایتون</option>
              <option value="PHP">PHP</option>
              <option value="C#">سی شارپ</option>
              <option value="Ruby">روبی</option>
              <option value="Java">جاوا</option>
            </select>
          </div>
          <button onClick={handleSubmit} className="join-button">
            ورود به چت
          </button>
        </form>
      </main>
    </div>
  );
}

export default JoinChat;
