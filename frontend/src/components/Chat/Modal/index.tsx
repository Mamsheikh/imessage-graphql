import { useLazyQuery, useMutation } from '@apollo/client';
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
import { Session } from 'next-auth';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { conversationOperations } from '../../../graphql/operations/conversation';
import { userOperations } from '../../../graphql/operations/user';
import {
  CreateConversationData,
  CreateConversationVariables,
  SearchedUser,
  SearchUsersData,
  SearchUsersVariables,
} from '../../../utils/types';
import Participants from './Participants';
import UserSearchList from './UserSearchList';

type ModalProps = {
  session: Session;
  isOpen: boolean;
  onClose: () => void;
};

const ConversationModal: React.FC<ModalProps> = ({
  session,
  isOpen,
  onClose,
}) => {
  const {
    user: { id: userId },
  } = session;
  const [username, setUsername] = useState('');
  const [participants, setParticipants] = useState<SearchedUser[]>([]);
  const [searchUsers, { data, loading }] = useLazyQuery<
    SearchUsersData,
    SearchUsersVariables
  >(userOperations.Queries.searchUsers);
  const [createConversation, { loading: conversationLoading }] = useMutation<
    CreateConversationData,
    CreateConversationVariables
  >(conversationOperations.Mutations.createConversation);

  const onSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    await searchUsers({ variables: { username } });
  };

  const onCreateConversation = async () => {
    const participantsId = [userId, ...participants.map((p) => p.id)];
    try {
      const { data } = await createConversation({
        variables: { participantsId },
      });
      console.log('create conversate', data);
    } catch (error: any) {
      console.log('onCreateConversation error', error);
      toast.error(error?.message);
    }
  };

  const addParticipant = (user: SearchedUser) => {
    const participantsId = participants.map((p) => p.id);
    for (let i = 0; i < participantsId.length; i++) {
      const element = participantsId[i];
      if (user.id === element) return;
    }
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
              />
            )}
            {participants.length !== 0 && (
              <>
                <Participants
                  participants={participants}
                  removeParticipant={removeParticipant}
                />
                <Button
                  bg='brand.100'
                  width='100%'
                  mt={6}
                  _hover={{ bg: 'brand.100' }}
                  isLoading={conversationLoading}
                  onClick={onCreateConversation}
                >
                  Create Conversation
                </Button>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ConversationModal;
