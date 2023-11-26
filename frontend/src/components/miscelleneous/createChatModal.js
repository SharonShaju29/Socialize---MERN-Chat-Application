import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  FormControl,
  Input,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import UserListItem from "../user/userListItem";
import Lottie from "react-lottie";
import animationData from "../../Animations/newUserModalLoader.json";
import animationDataForFiller from "../../Animations/newChatFiller.json";
import animationDataForNoResultsFound from "../../Animations/noResults.json";

const CreateChatModal = ({ children }) => {
  const [searchResult, setSearchResult] = useState([]);
  const [fillerFlag, setFillerFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [loadingChat, setLoadingChat] = useState(false);
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

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
      setSelectedChat(data[0]);
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

  const handleSearch = async (val) => {
    if (val) {
      try {
        setLoading(true);
        setFillerFlag(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.get(
          `/api/user?searchQuery=${val}`,
          config
        );

        setLoading(false);
        setSearchResult(data);
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
    } else {
      setSearchResult([]);
      setFillerFlag(false);
    }
  };

  return (
    <div>
      <div onClick={onOpen}>{children}</div>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent width={"90%"} height={"400px"}>
          <ModalHeader
            fontSize={"20px"}
            fontFamily={"Work sans"}
            display={"flex"}
            fontWeight={"bold"}
            justifyContent={"center"}
          >
            New Chat
            <div style={{ position: "absolute", right: "16px" }}>
              <CloseIcon onClick={onClose} />
            </div>
          </ModalHeader>
          <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
            <FormControl>
              <Input
                placeholder="Add users"
                mb={1}
                fontSize={"14px"}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Lottie
                options={defaultOptions}
                style={{ marginBottom: 15, marginLeft: 0, marginTop: "40px" }}
                height={"200px"}
              />
            ) : searchResult.length === 0 && fillerFlag ? (
              <Lottie
                options={defaultOptionsForNoResultsFound}
                style={{ marginBottom: 15, marginLeft: 0, marginTop: "20px" }}
                height={"200px"}
              />
            ) : fillerFlag ? (
              searchResult?.slice(0, 4).map((user) => (
                <UserListItem
                  user={user}
                  key={user._id}
                  handleFunction={() => {
                    accessChat(user._id);
                  }}
                />
              ))
            ) : (
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
                  Add new people to your network
                </div>
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CreateChatModal;
