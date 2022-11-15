import styles from "./ChatMessage.module.css";

export function ChatMessage({ messageDetails }) {
  return (
    <div className={styles.chatmessageCard}>
      <span className={styles.chatmessageUsername}>
        {messageDetails.sender_nickname}
      </span>
      <p>{messageDetails.message}</p>
      <div className={styles.chatmessageFooter}>
        {new Date(messageDetails.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        })}
      </div>
    </div>
  );
}
