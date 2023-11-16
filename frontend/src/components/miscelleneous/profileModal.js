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
            fontSize={"24px"}
            fontFamily={"Work sans"}
            fontWeight={"bold"}
            display={"flex"}
            justifyContent={"center"}
          >
            {user.name}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProfileModal;
