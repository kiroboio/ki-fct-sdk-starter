import { Alert, Icon } from '@chakra-ui/react';
import { AlertCircle } from 'react-feather';

export const WarningAlert = ({ message }: { message: string }) => {
  return (
    <Alert
      ml="25px"
      width={['400px', '400px', '400px', '400px', '950px']}
      status="warning"
      mb="10px"
      backgroundColor="gray.800"
    >
      {/* <AlertIcon /> */}
      <Icon as={AlertCircle} color="yellow.500" boxSize="22px" mr="10px" />
      {message}
    </Alert>
  );
};
