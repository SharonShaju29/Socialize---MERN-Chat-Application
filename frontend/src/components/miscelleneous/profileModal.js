import { ViewIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Modal,
  Button,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Image,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <Tooltip label={"View Contact Info"}
        placement={"bottom-start"}
        hasArrow>
        <IconButton
          color={"blue.400"}
          background={"gray.700"}
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
        </Tooltip>
      )}
      <Modal size={"xs"} isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius={"16px"}>
          <ModalHeader>
            <center>
              <Image
                borderRadius={"full"}
                boxSize={"150px"}
                src={user.profilePicture ?? user.pic}
                alt={user.name}
              />
            </center>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            fontSize={"20px"}
            fontFamily={"Work sans"}
            fontWeight={"bold"}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            flexWrap={"nowrap"}
            padding={"8px 0"}
          >
            <div style={{display:"flex",flexDirection:"row",justifyContent:"center",marginBottom:"4px"}}>{user.name}</div>
            <div style={{display:"flex",flexDirection:"row",justifyContent:"center",fontSize:"16px"}}><div style={{fontStyle:"bold",color:"grey",marginRight:"8px"}}>Email:</div><div>{user.email}</div></div> 
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProfileModal;
