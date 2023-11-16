import React from "react";
import {
  Box,
  Container,
  Tabs,
  Tab,
  TabPanels,
  TabList,
  TabPanel,
  Image,
} from "@chakra-ui/react";
import Login from "../components/authentication/Login";
import SignUp from "../components/authentication/SignUp";
import LOGO from "../Assets/logo.svg";

const HomePage = () => {
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="8px"
        borderWidth="1px"
      >
        <center>
          <Image src={LOGO} height={"48px"}  />
        </center>
      </Box>
      <Box
        bg={"white"}
        borderRadius="8px"
        p={"4"}
        w={"100%"}
        borderWidth={"1px"}
      >
        <Tabs variant="soft-rounded">
          <TabList mb={"1em"}>
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
