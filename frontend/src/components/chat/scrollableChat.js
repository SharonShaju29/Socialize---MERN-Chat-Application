import React, { useEffect,useRef } from "react";
// import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/chatLogics";
import { ChatState } from "../../context/ChatProvider";
import { Avatar, Tooltip } from "@chakra-ui/react";
import "./styles/scrollableChat.css";

const ScrollableChat = ({ messages, scrollBottom }) => {
  const { user } = ChatState();

  const feedContainerRef = useRef(null);


  const scrollToBottom = () => {
    if (feedContainerRef) {
      feedContainerRef.current.scrollTop = feedContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [scrollBottom]);

  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
      <div ref={feedContainerRef} className="scroller-wrapper">
        {messages &&
          messages.map((message, index) => (
            <div
              style={{ display: "flex" }}
              key={message._id}
              className="chat-container"
            >
              {(isSameSender(messages, message, index, user._id) ||
                isLastMessage(messages, index, user._id)) && (
                <Tooltip
                  label={message.sender.name}
                  placement={"bottom-start"}
                  hasArrow
                >
                  <Avatar
                    mt={"7px"}
                    mr={1}
                    size={"sm"}
                    cursor={"pointer"}
                    name={message.sender.name}
                    src={message.sender.profilePicture}
                  />
                </Tooltip>
              )}
              <span
                className="chat-font"
                style={{
                  background:
                    message.sender._id === user._id ? "#BEE3F8" : "#96fadf",
                  borderRadius:
                    message.sender._id === user._id
                      ? "12px 12px 0 12px"
                      : "12px 12px 12px 0",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  marginLeft: isSameSenderMargin(
                    messages,
                    message,
                    index,
                    user._id
                  ),
                  marginTop: isSameUser(messages, message, index, user._id)
                    ? 3
                    : 10,
                }}
              >
                {message.content}
              </span>
            </div>
          ))}
      </div>
  );
};

export default ScrollableChat;
