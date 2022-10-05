import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Stack,
  Input,
} from '@chakra-ui/react';
import React, { useState } from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ConversationModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg='#2d2d2d' pb={4}>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              <Stack spacing={4}>
                <Input
                  placeholder='Enter a username'
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
                <Button type='submit' disabled={!username}>
                  Search
                </Button>
              </Stack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ConversationModal;
