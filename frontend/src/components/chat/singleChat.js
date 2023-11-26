import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  InputRightElement,
  Button,
  Text,
  useToast,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalContent,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderInfo } from "../../config/chatLogics";
import ProfileModal from "../miscelleneous/profileModal";
import UpdateGroupChatModal from "../miscelleneous/updateGroupChatModal";
import axios from "axios";
import ScrollableChat from "./scrollableChat";
import "./styles/singleChat.css";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../../Animations/typing.json";
import animationDataFiller from "../../Animations/chatFiller.json";
import EmojiPicker from "emoji-picker-react";
import "./styles/singleChat.css";

const ENDPOINT = "https://socialize-6s8z.onrender.com";

var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const {
    user,
    selectedChat,
    setChats,
    chats,
    setSelectedChat,
    notification,
    setNotification,
  } = ChatState();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState([]);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [scrollBottom, setScrollBottom] = useState(false);
  const [openEmojiModal, setOpenEmojiModal] = useState(false);

  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const defaultOptionsForFiller = {
    loop: true,
    autoplay: true,
    animationData: animationDataFiller,
    rendererSettings: {
      preserveAspectRatio: "",
    },
  };

  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => {
      setIsTyping(true);
      setScrollBottom(!scrollBottom);
    });
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  const sendMessage = async (e) => {
    if ((e.key === "Enter" || e.type === "click") && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          { content: newMessage, chatId: selectedChat._id },
          config
        );
        setOpenEmojiModal(false);
        setNewMessage("");

        socket.emit("newMessage", data);
        setMessages([...messages, data]);
        if (selectedChat) {
          const filteredChats = chats.filter(
            (chat) => chat._id !== selectedChat._id
          );
          setChats([selectedChat, ...filteredChats]);
        }
        setScrollBottom(!scrollBottom);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const handleEmoji = (e) => {
    setNewMessage(newMessage + `${e.emoji}`);
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // typing indicator

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      setScrollBottom(!scrollBottom);
      socket.emit("typing", selectedChat._id);
    }

    let lastTyping = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTyping;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    if (selectedChat) {
      const filteredChats = chats.filter(
        (chat) => chat._id !== selectedChat._id
      );
      if (chats.length === filteredChats.length) {
        setChats([selectedChat, ...filteredChats]);
      }
    }
    fetchMessages();

    selectedChatCompare = selectedChat;
    setOpenEmojiModal(false);
    setNewMessage("");
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "24px", md: "24px" }}
            pb={3}
            px={2}
            w={"100%"}
            fontFamily={"Work sans"}
            fontWeight={"bold"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderInfo(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>

          <Box
            display={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg={"#E8E8E8"}
            w={"100%"}
            h="100%"
            borderRadius={"lg"}
            overflowY={"hidden"}
          >
            {loading ? (
              <Spinner
                size={"lg"}
                w={10}
                h={10}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <div className="message-wrapper">
                <ScrollableChat
                  messages={messages}
                  scrollBottom={scrollBottom}
                />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 0, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              {openEmojiModal && (
                <div className="emoji-wrapper">
                  <EmojiPicker
                    onEmojiClick={handleEmoji}
                    autoFocusSearch={false}
                  />
                </div>
              )}
              <InputGroup>
                <InputLeftElement>
                  <div
                    style={{ fontSize: "20px", cursor: "pointer" }}
                    onClick={() => setOpenEmojiModal(!openEmojiModal)}
                  >
                    <i class="fa fa-smile" aria-hidden="true"></i>
                  </div>
                </InputLeftElement>
                <Input
                  variant={"filled"}
                  bg={"whitesmoke"}
                  placeholder="Enter a messsage..."
                  onChange={typingHandler}
                  value={newMessage}
                />
                <InputRightElement width={"4.5rem"}>
                  <Button
                    h="1.75rem"
                    size={"sm"}
                    onClick={sendMessage}
                    fontSize={"12px"}
                    color={"blue.400"}
                    background={"gray.700"}
                  >
                    <i class="fa fa-paper-plane" aria-hidden="true"></i>
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          flexDir={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          h="100%"
        >
          <Lottie
            options={defaultOptionsForFiller}
            width={"60vw"}
            height={"50vh"}
            style={{ marginBottom: 15, marginLeft: 0 }}
          />
          <Text
            fontSize={"2xl"}
            pb={3}
            fontFamily={"work sans"}
            fontWeight={"bold"}
            fontStyle={"italic"}
          >
            Click on a chat to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
