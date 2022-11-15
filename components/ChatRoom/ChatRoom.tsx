import {
  useEffect,
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import { ChatMessage } from "../ChatMessage/ChatMessage";
import {
  getMessageList,
  addMessageListener,
  removeMessageListener,
  sendMessage,
} from "@livelike/core-api";
import styles from "./ChatRoom.module.css";

export function ChatRoom({ roomId, messages: propMessages }) {
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
    if (chatRoomListNodeRef.current) {
      chatRoomListNodeRef.current.scrollTop =
        chatRoomListNodeRef.current.scrollHeight;
    }
    function onMessage({ event, message }) {
      if (event === "messagereceived") {
        setMessageList([...messages, message]);
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
  }, [messages]);

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
