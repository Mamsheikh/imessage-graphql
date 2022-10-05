import { useLazyQuery } from '@apollo/client';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { userOperations } from '../../../graphql/operations/user';
import {
  SearchedUser,
  SearchUsersData,
  SearchUsersVariables,
} from '../../../utils/types';
import UserSearchList from './UserSearchList';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ConversationModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [participants, setParticipants] = useState<SearchedUser[]>([]);
  const [searchUsers, { data, loading }] = useLazyQuery<
    SearchUsersData,
    SearchUsersVariables
  >(userOperations.Queries.searchUsers);
  console.log('search users', data);

  const onSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    await searchUsers({ variables: { username } });
  };

  const addParticipant = (user: SearchedUser) => {
    setParticipants((prev) => [...prev, user]);
    setUsername('');
  };

  const removeParticipant = (userId: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== userId));
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg='#2d2d2d' pb={4}>
          <ModalHeader>Create a conversation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={onSearch}>
              <Stack spacing={4}>
                <Input
                  placeholder='Enter a username'
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
                <Button type='submit' disabled={!username} isLoading={loading}>
                  Search
                </Button>
              </Stack>
            </form>
            {data?.searchUsers && (
              <UserSearchList
                users={data?.searchUsers}
                addParticipant={addParticipant}
                removeParticipant={removeParticipant}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ConversationModal;
