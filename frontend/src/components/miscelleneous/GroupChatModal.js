import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  useToast,
  ModalContent,
  FormControl,
  Input,
  ModalFooter,
  Button,
  Box,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import UserListItem from "../user/userListItem";
import UserBadgeItem from "../user/userBadgeItem";
import Lottie from "react-lottie";
import animationData from "../../Animations/newUserModalLoader.json";
import animationDataForFiller from "../../Animations/newChatFiller.json";
import animationDataForNoResultsFound from "../../Animations/noResults.json";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [fillerFlag, setFillerFlag] = useState(false);
  const [loading, setLoading] = useState(false);

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
    animationData: animationDataForFiller,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const defaultOptionsForNoResultsFound = {
    loop: true,
    autoplay: true,
    animationData: animationDataForNoResultsFound,
    rendererSettings: {
      preserveAspectRatio: "",
    },
  };

  const { user, chats, setChats } = ChatState();

  const handleGroup = (user) => {
    if (selectedUsers.filter((selectedUser) => selectedUser._id === user._id)) {
      toast({
        title: "user already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, user]);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]);
      setFillerFlag(false);
      return;
    }
    setFillerFlag(true);
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/user?searchQuery=${query}`,
        config
      );

      setLoading(false);
      setSearchResult(data);
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: "Failed to fetch search results",
        duration: 5000,
        status: "error",
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((user) => user._id)),
        },
        config
      );

      setChats([data, ...chats]);
      onClose();
      toast({
        title: "Group created Successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to create group",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((user) => delUser._id !== user._id));
  };

  return (
    <div>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent w={"90%"} minHeight={"600px"}>
          <ModalHeader
            fontSize={"20px"}
            fontFamily={"Work sans"}
            display={"flex"}
            fontWeight={"bold"}
            justifyContent={"center"}
          >
            Create Group Chat
          </ModalHeader>
          <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
            <FormControl>
              <Input
                placeholder="Chat name"
                mb={3}
                fontSize={"14px"}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add users"
                mb={1}
                fontSize={"14px"}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w={"100%"} display={"flex"} flexWrap={"wrap"}>
              {selectedUsers.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleDelete(user)}
                />
              ))}
            </Box>
            {loading ? (
              <Lottie
                options={defaultOptions}
                style={{ marginBottom: 15, marginLeft: 0, marginTop: "40px" }}
                height={"200px"}
              />
            ) : searchResult.length === 0 ? (
              fillerFlag ? (
                <Lottie
                  options={defaultOptionsForNoResultsFound}
                  style={{ marginBottom: 15, marginLeft: 0, marginTop: "20px" }}
                  height={"200px"}
                />
              ) : selectedUsers.length === 0 ? (
                <div>
                  <Lottie
                    options={defaultOptionsForFiller}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                    height={"200px"}
                  />
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      fontStyle: "italic",
                    }}
                  >
                    Add people to the group
                  </div>
                </div>
              ) : (
                <></>
              )
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    user={user}
                    key={user._id}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              color={"blue.400"}
              background={"gray.700"}
              onClick={handleSubmit}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default GroupChatModal;
