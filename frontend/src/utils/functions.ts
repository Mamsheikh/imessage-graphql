import { ParticipantPopulated } from '../../../backend/src/utils/types';

export const formatUsernames = (
  participants: Array<ParticipantPopulated>,
  myUserId: string
): string => {
  const usernames = participants
    .filter((participant) => participant.user.id != myUserId)
    .map((participant) => participant.user.username);

  return usernames.join(', ');
};

export const showParticipantImage = (
  participants: Array<ParticipantPopulated>,
  myUserId: string
) => {
  const userImages = participants
    .filter((participant) => participant.user.id != myUserId)
    .map((participant) => participant.user.image);

  return userImages.join('');
};

export const checkImage = (file: File) => {
  let err = '';
  if (!file) return (err = 'File does not exist');

  if (file.size > 1024 * 1024) return (err = 'File must be less than 1mb');

  if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
    return (err = 'Invalid image format');
  }

  return err;
};
