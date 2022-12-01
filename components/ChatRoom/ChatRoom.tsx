import { useEffect, useState, useRef, useCallback } from "react";
import { ChatMessage } from "../ChatMessage/ChatMessage";
import {
  addMessageListener,
  IChatMessageResponsePayload,
  IMessageListenerCallbackArgs,
  removeMessageListener,
  sendMessage,
} from "@livelike/javascript";
import styles from "./ChatRoom.module.css";
import { useUserProfile } from "../UserProfileProvider/UserProfileProvider";

interface IChatRoomProps {
  roomId: string;
  messages: IChatMessageResponsePayload[];
}

export function ChatRoom({ roomId, messages: propMessages }: IChatRoomProps) {
  const profile = useUserProfile();
  const [messages, setMessageList] = useState(propMessages);
  const [chatRoomInput, setChatRoomInput] = useState("");
  const chatRoomListNodeRef = useRef<HTMLDivElement>(null);
  const updateMessageList = useCallback(
    (
      message: IChatMessageResponsePayload,
      _messages: IChatMessageResponsePayload[]
    ) => {
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
    function onMessage({ event, message }: IMessageListenerCallbackArgs) {
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
  const onSendImageMessage = () => {
    sendMessage({
      roomId,
      image_url:
        "https://media0.giphy.com/media/3ogwFGEHrVxusDbDjO/giphy.gif?cid=b5f7e4ddqy9poflflu3tflaz7kgwgmi5hxqvvebvb0jeip63&rid=giphy.gif&ct=g",
      image_width: "480",
      image_height: "360",
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
        <button
          className={styles.sendButton}
          onClick={() => {
            onSendImageMessage();
          }}
        >
          Image
        </button>
        <button
          className={styles.sendButton}
          onClick={() =>
            chatRoomInput && chatRoomInput.length && onSendMessage()
          }
        >
          Send
        </button>
      </div>
    </>
  );
}
