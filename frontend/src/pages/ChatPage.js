import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { ChatState } from "../context/ChatProvider";
import SideBar from "../components/miscelleneous/sideBar";
import ChatBox from "../components/chat/chatBox";
import MyChats from "../components/chat/myChats";
import { Box } from "@chakra-ui/react";

const ChatPage = () => {
  const history = useHistory();
  const [loggedUser, setLoggedUser] = useState();
  const { user } = ChatState();

  useEffect(() => {
    const JwtToken = user ?? JSON.parse(localStorage.getItem("userInfo"));
    const userInfo = JwtToken;
    setLoggedUser(userInfo);

    if (!userInfo) {
      history.push("/");
    }
  }, [history]);

  const [fetchAgain, setFetchAgain] = useState();

  return (
    <div style={{ width: "100%" }}>
      {loggedUser && <SideBar />}
      <Box
        display="flex"
        justifyContent={"space-between"}
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {loggedUser && (
          <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
        {loggedUser && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
