import { useEffect, useState, useRef, useCallback } from "react";
import { ChatMessage } from "../ChatMessage/ChatMessage";
import {
  addMessageListener,
  removeMessageListener,
  sendMessage,
} from "@livelike/core-api";
import styles from "./ChatRoom.module.css";
import { useUserProfile } from "../UserProfileProvider/UserProfileProvider";

export function ChatRoom({ roomId, messages: propMessages }) {
  const profile = useUserProfile();
  const [messages, setMessageList] = useState(propMessages);
  const [chatRoomInput, setChatRoomInput] = useState("");
  const chatRoomListNodeRef = useRef(null);
  const updateMessageList = useCallback(
    (message, _messages) => {
      const msgIndex = _messages.findIndex(({ id }) => id === message.id);
      const updatedMessageList =
        msgIndex > -1
          ? _messages.map((msg, i) => (i === msgIndex ? message : msg))
          : [..._messages, message];
      setMessageList(updatedMessageList);
      if (chatRoomListNodeRef?.current) {
        chatRoomListNodeRef.current.scrollTop = 100000000;
      }
      return updatedMessageList;
    },
    [messages]
  );

  useEffect(() => {
    // add message listener only when client profile is present
    // i.e. sdk is initialised
    if (!profile) {
      return;
    }
    if (chatRoomListNodeRef.current) {
      chatRoomListNodeRef.current.scrollTop =
        chatRoomListNodeRef.current.scrollHeight;
    }
    function onMessage({ event, message }) {
      if (event === "messagereceived") {
        const msgIndex = messages.findIndex((msg) => msg.id === message.id);
        if (msgIndex > -1) {
          const newList = [...messages];
          newList.splice(msgIndex, 1, message);
          setMessageList(newList);
        } else {
          setMessageList([...messages, message]);
        }
      }
    }
    addMessageListener(
      {
        roomId,
      },
      onMessage
    );

    return () => {
      removeMessageListener({ roomId }, onMessage);
    };
  }, [messages, profile]);

  useEffect(() => {
    if (chatRoomListNodeRef?.current) {
      chatRoomListNodeRef.current.scrollTop =
        chatRoomListNodeRef.current.scrollHeight;
    }
  }, []);

  const onSendMessage = () => {
    setChatRoomInput("");
    sendMessage({
      roomId,
      message: chatRoomInput,
    }).then((res) => {
      updateMessageList(res, messages);
    });
  };
  return (
    <>
      <div className={styles.chatroomList} ref={chatRoomListNodeRef}>
        {messages?.length
          ? messages.map((message) => (
              <ChatMessage key={message.id} messageDetails={message} />
            ))
          : null}
      </div>
      <div className={styles.inputContainer}>
        <input
          className={styles.chatroomInput}
          onChange={(e) => setChatRoomInput(e.target.value)}
          onKeyDown={(e) => e.which === 13 && onSendMessage()}
          value={chatRoomInput}
          placeholder="Enter Message"
        />
        <button className={styles.sendButton}>Send</button>
      </div>
    </>
  );
}
