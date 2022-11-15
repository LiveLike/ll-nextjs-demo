import { useRouter } from "next/router";
import { initApi, getMessageList } from "@livelike/core-api";
import { ChatRoom } from "../../components/ChatRoom/ChatRoom";
import styles from "./[roomId].module.css";
import { UserProfileProvider } from "../../components/UserProfileProvider/UserProfileProvider";

interface IChatroomProps {
  messages: any;
  profile: any;
}

export default function Chatroom(props: IChatroomProps) {
  const router = useRouter();
  const { roomId } = router.query;
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
  const profile = await initApi({
    endpoint: "https://cf-blast-dig.livelikecdn.com/api/v1/",
    clientId: "lom9db0XtQUhOZQq1vz8QPfSpiyyxppiUVGMcAje",
  });
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
