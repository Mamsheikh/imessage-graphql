import { Skeleton } from '@chakra-ui/react';

interface SkeletonLoaderProps {
  count: number;
  height: string;
  width?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  count,
  height,
  width,
}) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <Skeleton
          startColor='blackAlpha.400'
          endColor='whiteAlpha.300'
          height={height}
          //   width={width}
          borderRadius={4}
          width={{ base: 'full' }}
          key={i}
        />
      ))}
    </>
  );
};

export default SkeletonLoader;
