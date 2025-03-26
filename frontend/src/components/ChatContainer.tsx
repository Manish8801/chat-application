import useChatStore from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import useAuthStore from "../store/useAuthStore";
import formateMessageTime from "../lib/utils";
import { useEffect, useRef } from "react";
import MessageSkeleton from "./skeletons/MessageSkeleton";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }

    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (lastMessageRef.current && messages) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="chat-bod flex flex-col flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser?._id ? "chat-end" : "chat-start"
            } duration-50 ease-in`}
            ref={lastMessageRef}
          >
            <div className="chat-header mb-1">
              <time className="text-sx opacity-50 ml-1">
                {formateMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble sm:text-base flex flex-col">
              {message?.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-mb mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
