import { useLazyQuery, useMutation } from '@apollo/client';
import {
  Avatar,
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { Step, Steps, useSteps } from 'chakra-ui-steps';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import React, { FormEvent, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { AiFillCamera } from 'react-icons/ai';
import conversationOperations from '../../../graphql/operations/conversation';
import userOperations from '../../../graphql/operations/user';
import { checkImage } from '../../../utils/functions';
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
  const [file, setFile] = useState();
  const inputAvatarRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [participants, setParticipants] = useState<SearchedUser[]>([]);
  const [groupName, setGroupName] = useState('');
  const { nextStep, prevStep, setStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });

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

  const step1 = (
    <form onSubmit={onSearch}>
      <Stack spacing={4}>
        <Input
          placeholder='Enter a Group name'
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <Button type='submit' disabled={!username} isLoading={loading}>
          Search
        </Button>
      </Stack>
    </form>
  );

  const step2 = (
    <form>
      <Stack spacing={4}>
        <Input placeholder='Enter a username' />
      </Stack>
    </form>
  );
  const steps = [
    { label: 'Step 1', step1 },
    { label: 'Step 2', step2 },
    { label: 'Step 3', step1 },
  ];
  const onCreateConversation = async () => {
    const participantIds = [userId, ...participants.map((p) => p.id)];
    try {
      const { data } = await createConversation({
        variables: { participantIds },
      });

      if (!data?.createConversation) {
        throw new Error('failde to create a conversation');
      }

      const {
        createConversation: { conversationId },
      } = data;
      router.push({ query: { conversationId } });

      /* *
      clear state and close modal on successfull conversation creation
      * */
      setParticipants([]);
      setUsername('');
      onClose();
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

  const handleAvatar = async (e: any) => {
    const file = e.target.files[0];

    const err = checkImage(file);
    if (err) toast.error(err);

    // console.log(image);

    setFile(file);
  };
  console.log(file);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg='#2d2d2d' pb={4}>
          <ModalHeader>Create a conversation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs isFitted variant='enclosed'>
              <TabList mb='1em'>
                <Tab>Create a conversation</Tab>
                <Tab>Create a group</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <form onSubmit={onSearch}>
                    <Stack spacing={4}>
                      <Input
                        placeholder='Enter a username'
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                      />
                      <Button
                        type='submit'
                        disabled={!username}
                        isLoading={loading}
                      >
                        Search
                      </Button>
                    </Stack>
                  </form>
                </TabPanel>
                <TabPanel>
                  <Flex flexDir='column' width='100%'>
                    <Steps activeStep={activeStep} width='100%'>
                      <Step>
                        <form onSubmit={onSearch}>
                          <Flex p={4}>
                            <Avatar
                              src={file && URL.createObjectURL(file)}
                              mr={4}
                              ref={inputAvatarRef}
                              size='lg'
                              cursor='pointer'
                              icon={
                                <AiFillCamera
                                // _hover={{ color: 'whiteAlpha.300' }}
                                />
                              }
                              onClick={() =>
                                inputAvatarRef.current &&
                                inputAvatarRef.current.click()
                              }
                            />
                            <input
                              type='file'
                              name='avatar'
                              ref={inputAvatarRef}
                              id='avatar'
                              accept='image/*'
                              onChange={handleAvatar}
                              style={{ display: 'none' }}
                            />
                            <Input
                              placeholder='Enter a Group name'
                              value={groupName}
                              onChange={(event) =>
                                setGroupName(event.target.value)
                              }
                              variant='flushed'
                            />
                            {/* <Button
                                type='submit'
                                disabled={!username}
                                isLoading={loading}
                              >
                                Search
                              </Button> */}
                          </Flex>
                        </form>
                      </Step>
                      <Step>
                        <form onSubmit={onSearch}>
                          <Text justifySelf='center' size='14px'>
                            Add Participants
                          </Text>
                          <Flex p={4} justify='space-evenly'>
                            <Input
                              placeholder='Enter a  username'
                              value={username}
                              onChange={(event) =>
                                setUsername(event.target.value)
                              }
                            />
                          </Flex>
                          <Button
                            type='submit'
                            disabled={!username}
                            isLoading={loading}
                            w='100%'
                            mb={4}
                          >
                            Search
                          </Button>
                        </form>
                      </Step>
                    </Steps>
                    {activeStep === steps.length - 1 ? (
                      <>
                        <Flex p={4} align='center'>
                          <Avatar
                            src={file && URL.createObjectURL(file)}
                            mr={4}
                            size='lg'
                            cursor='pointer'
                            icon={<AiFillCamera />}
                          />
                          <Text align='center'>{groupName}</Text>
                        </Flex>
                        <Flex w='100%' justify='flex-end'>
                          <Button
                            isDisabled={activeStep === 0}
                            mr={4}
                            onClick={prevStep}
                            size='sm'
                            variant='ghost'
                            alignContent='end'
                          >
                            Prev
                          </Button>
                        </Flex>
                      </>
                    ) : (
                      <Flex width='100%' justify='flex-end'>
                        <Button
                          isDisabled={activeStep === 0}
                          mr={4}
                          onClick={prevStep}
                          size='sm'
                          variant='ghost'
                        >
                          Prev
                        </Button>
                        <Button size='sm' onClick={nextStep}>
                          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                      </Flex>
                    )}
                  </Flex>
                </TabPanel>
              </TabPanels>
            </Tabs>

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
