import { Stack, Text, Flex, Avatar, Button } from '@chakra-ui/react';
import { SearchedUser } from '../../../utils/types';

interface UserSearchListProps {
  users: Array<SearchedUser>;
}

const UserSearchList: React.FC<UserSearchListProps> = ({ users }) => {
  return (
    <>
      {users.length === 0 ? (
        <Flex justify='center' mt={6}>
          <Text>No users found</Text>
        </Flex>
      ) : (
        <Stack mt={6}>
          {users.map((user) => (
            <Stack
              key={user.id}
              align={'center'}
              spacing={4}
              py={2}
              px={4}
              borderRadius={4}
              direction={'row'}
              _hover={{ bg: 'whiteAlpha.200' }}
            >
              <Avatar />
              <Flex
                justify='space-between'
                align='center'
                width={'100%'}
                py={2}
              >
                <Text color='whiteAlpha.700'>{user.username}</Text>
                <Button bg='brand.100' _hover={{ bg: 'brand.100' }}>
                  Select
                </Button>
              </Flex>
            </Stack>
          ))}
        </Stack>
      )}
    </>
  );
};
export default UserSearchList;
