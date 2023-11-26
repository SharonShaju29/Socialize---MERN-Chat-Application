import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import {
  Box,
  Button,
  Stack,
  useToast,
  Text,
  Tooltip,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "../miscelleneous/chatLoading";
import { getSender, getSenderInfo } from "../../config/chatLogics";
import GroupChatModal from "../miscelleneous/GroupChatModal";
import { useHistory } from "react-router-dom";
import CreateChatModal from "../miscelleneous/createChatModal";

const MyChats = ({ fetchAgain, setFetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState([]);
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();

  useEffect(() => {
    const JwtToken = user ?? JSON.parse(localStorage.getItem("userInfo"));
    setLoggedUser(JwtToken);

    fetchChats();
  }, [fetchAgain]);

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir={"column"}
      alignItems={"center"}
      p={3}
      bg={"white"}
      w={{ base: "100%", md: "31%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "22px", md: "26px" }}
        fontFamily={"Work sans"}
        fontWeight={"bold"}
        display={"flex"}
        w={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        My Chats
        <Menu placement={"bottom-end"}>
          <MenuButton p={"1"}>
            <Tooltip label={"Add"} placement={"bottom-start"} hasArrow>
              <Button
                display={"flex"}
                fontSize={{ base: "17px", md: "10px", lg: "16px" }}
                width={"12px"}
                background={"gray.700"}
              >
                <AddIcon color={"blue.400"} />
              </Button>
            </Tooltip>
          </MenuButton>
          <MenuList
            justifyContent={"center"}
            display={"flex"}
            flexDirection={"column"}
            role="menu"
            whiteSpace={"pre-wrap"}
          >
            <MenuItem fontWeight={"bold"} fontSize={"16px"}>
              <CreateChatModal>
                <div style={{ paddingRight: "150px" }}>New chat</div>
              </CreateChatModal>
            </MenuItem>
            <center>
              <MenuDivider />
            </center>
            <MenuItem fontWeight={"bold"} fontSize={"16px"}>
              <GroupChatModal>
                <div style={{ paddingRight: "150px" }}>New group</div>
              </GroupChatModal>
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
      <Box
        display={"flex"}
        flexDir={"column"}
        p={3}
        bg="#F8F8F8"
        w={"100%"}
        h={"100%"}
        borderRadius={"lg"}
        overflowY={"hidden"}
      >
        {chats ? (
          <Stack overflowY={"scroll"}>
            {chats.length > 0 ? (
              chats.map((chat) => (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor={"pointer"}
                  bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius={"lg"}
                  key={chat._id}
                  display={"flex"}
                  height={"60px"}
                >
                  {!chat.isGroupChat ? (
                    <div style={{ display: "grid", alignContent: "center" }}>
                      <Avatar
                        size="sm"
                        cursor={"pointer"}
                        name={getSender(loggedUser, chat.users)}
                        src={
                          getSenderInfo(loggedUser, chat.users).profilePicture
                        }
                        marginRight={"16px"}
                        marginLeft={"8px"}
                        alignContent={"center"}
                      ></Avatar>
                    </div>
                  ) : (
                    <div
                      style={{
                        fontWeight: "bold",
                        fontStyle: "italic",
                        fontSize: "14px",
                        marginRight: "8px",
                        color: "grey",
                        alignContent: "center",
                        display: "grid",
                      }}
                    >
                      GROUP
                    </div>
                  )}
                  <Text
                    alignContent={"center"}
                    display={"grid"}
                    fontWeight={"semibold"}
                  >
                    {!chat?.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                </Box>
              ))
            ) : (
              <div
                style={{
                  height: "30vh",
                  justifyContent: "center",
                  alignContent: "center",
                  display: "grid",
                }}
              >
                Search for Users to add your first chat
              </div>
            )}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
