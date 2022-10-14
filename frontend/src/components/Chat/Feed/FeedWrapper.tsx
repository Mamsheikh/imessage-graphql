import { Flex } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import React from 'react';

interface FeedWrapperProps {
  session: Session;
}

const FeedWrapper: React.FC<FeedWrapperProps> = ({ session }) => {
  const router = useRouter();

  const { conversationId } = router.query;

  return (
    <Flex
      display={{ base: conversationId ? 'flex' : 'none', md: 'flex' }}
      // border='1px solid red'
      width='100%'
      direction='column'
    >
      {conversationId ? (
        <Flex>{conversationId}</Flex>
      ) : (
        <div>No conversation selected </div>
      )}
    </Flex>
  );
};
export default FeedWrapper;
