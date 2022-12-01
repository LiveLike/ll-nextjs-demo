import { useRouter } from "next/router";
import { init, getMessageList, sendMessage } from "@livelike/javascript";
import { ChatRoom } from "../../components/ChatRoom/ChatRoom";
import styles from "./[roomId].module.css";
import { UserProfileProvider } from "../../components/UserProfileProvider/UserProfileProvider";
import { APITester } from "../../components/APITester";

interface IChatroomProps {
  messages: any;
  profile: any;
}

export default function Chatroom(props: IChatroomProps) {
  const router = useRouter();
  const { roomId } = router.query;
  if (typeof roomId !== "string") {
    return null;
  }
  return (
    <UserProfileProvider profile={props.profile}>
      <div className={styles.pageContainer}>
        <h1 className={styles.nickname}>Welcome {props.profile.nickname}</h1>
        <h3 className={styles.roomId}>ChatRoom Id: {roomId}</h3>
        <main className={styles.chatroomContainer}>
          <ChatRoom roomId={roomId} messages={props.messages} />
        </main>
      </div>
    </UserProfileProvider>
  );
}

export async function getServerSideProps(context) {
  const profile = await init({
    endpoint: "https://cf-blast-dig.livelikecdn.com/api/v1/",
    clientId: "lom9db0XtQUhOZQq1vz8QPfSpiyyxppiUVGMcAje",
  });
  // await sendMessage({
  //   roomId: "6c5577e7-95cf-40ff-9a29-a6f57d0da322",
  //   image_url:
  //     "https://media0.giphy.com/media/3ogwFGEHrVxusDbDjO/giphy.gif?cid=b5f7e4ddqy9poflflu3tflaz7kgwgmi5hxqvvebvb0jeip63&rid=giphy.gif&ct=g",
  //   image_width: "480",
  //   image_height: "360",
  // }).then((res) => {
  //   console.log("image message send", res);
  // });

  await APITester();

  const messageResponse = await getMessageList(context.params.roomId);
  return {
    props: {
      messages: messageResponse?.messages
        ? JSON.parse(JSON.stringify(messageResponse.messages))
        : null,
      profile: JSON.parse(JSON.stringify(profile)),
    }, // will be passed to the page component as props
  };
}
