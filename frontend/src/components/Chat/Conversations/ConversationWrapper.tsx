import { Session } from 'next-auth';
import React from 'react';

interface ConversationWrapperProps {
  session: Session;
}

const ConversationWrapper: React.FC<ConversationWrapperProps> = ({
  session,
}) => {
  return <div>Conversations Wrapper</div>;
};
export default ConversationWrapper;
