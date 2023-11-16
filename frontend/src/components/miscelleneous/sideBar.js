import {
  Box,
  Button,
  Tooltip,
  Image,
  Menu,
  MenuButton,
  Avatar,
  MenuItem,
  MenuList,
  MenuDivider,
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BellIcon, ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "./profileModal";
import { useHistory } from "react-router-dom";
import axios from "axios";
import ChatLoading from "./chatLoading";
import UserListItem from "../user/userListItem";
import { getSender } from "../../config/chatLogics";
import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge/lib/components/NotificationBadge";
import LOGO from "../../Assets/logo.svg";

const SideBar = () => {
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState();
  const [resultsFoundFlag, setResultsFoundFlag] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const history = useHistory();

  const {
    user,
    setUser,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    setChats([]);
    history.push("/");

  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter some value to search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/user?searchQuery=${search}`,
        config
      );

      setLoading(false);
      setSearchResult(data);
      setResultsFoundFlag(true);
    } catch (err) {
      toast({
        title: "Error Occured",
        description: "Failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoadingChat(true);

      const { data } = await axios.post("/api/chat", { userId }, config);

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (err) {
      toast({
        title: "Error fetching the chat",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoadingChat(false);
    }
  };

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        w={"100%"}
        p={"5px 10px 5px 10px"}
        borderWidth={"5px"}
      >
        <Tooltip label="Search Users" hasArrow placement="bottom-end">
          <Button variant={"ghost"} onClick={onOpen}>
            <i class="fas fa-search" style={{ padding: "0 4px 0 0" }}></i>
            {/* <Text display={{ base: "none", md: "flex" }}> Search User </Text> */}
          </Button>
        </Tooltip>
        <Image src={LOGO} height={"48px"} marginLeft={"52px"} />
        <div>
          <Menu>
            <MenuButton p={"1"}>
              <NotificationBadge count={notification.length} effect={Effect} />
              <BellIcon fontSize={"2xl"} m={1}></BellIcon>
            </MenuButton>
            <MenuList justifyContent={"center"} display={"flex"}>
              {!notification.length && "No new messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              background={"gray.700"}
              color="blue.400"
              rightIcon={<ChevronDownIcon />}
            >
              <Avatar
                size="sm"
                cursor={"pointer"}
                name={user.name}
                src={user.pic}
              ></Avatar>
            </MenuButton>
            <MenuList fontSize={"14px"}>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerHeader>Search Users</DrawerHeader>

            <DrawerBody>
              <Box display={"flex"} pb={"2"}>
                <Input
                  placeholder="Search by name or email"
                  mr={"2"}
                  value={search}
                  background={"#EDF2F7"}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setResultsFoundFlag(false);
                  }}
                />
                <Button
                  background={"gray.700"}
                  color={"blue.400"}
                  onClick={handleSearch}
                >
                  <SearchIcon />
                </Button>
              </Box>
              {loading ? (
                <ChatLoading />
              ) : searchResult.length ? (
                searchResult.map((user) => (
                  <UserListItem
                    Key={user._id}
                    user={user}
                    handleFunction={() => {
                      accessChat(user._id);
                    }}
                  />
                ))
              ) : (
                <div
                  style={{
                    alignContent: "center",
                    display: "grid",
                    height: "20vh",
                    justifyContent: "center",
                  }}
                >
                  {search
                    ? searchResult.length === 0 && resultsFoundFlag
                      ? `No search results found for "` + `${search}` + `"`
                      : ""
                    : "Enter a Keyword to search for users"}
                </div>
              )}
              {loadingChat && <Spinner ml={"auto"} display={"flex"} />}
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};

export default SideBar;
