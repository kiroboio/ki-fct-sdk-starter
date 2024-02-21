import { Alert, Icon } from '@chakra-ui/react';
import { AlertCircle } from 'react-feather';

export const ExternalWalletMissingAlert = ({ fctId }: { fctId: string }) => {


    return (
        <Alert
            ml="25px"
            width={['400px', '400px', '400px', '400px', '950px']}
            status="warning"
            mb="10px"
        >
            {/* <AlertIcon /> */}
            <Icon as={AlertCircle} color="yellow.500" boxSize="22px" mr="10px" />
            At present, unauthorized external wallet approvals are not supported by
            Flow,
        </Alert>
    );
};
