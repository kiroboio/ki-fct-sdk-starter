import { Button, HStack, Stack, Text } from '@chakra-ui/react'

interface PauseButtonProps {
  leftIcon: React.ReactNode
  title: string
  description: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  isLoading?: boolean
  isDisabled?: boolean
}

export const PauseButton = ({ leftIcon, title, description, isLoading, isDisabled, onClick }: PauseButtonProps) => {
  return (
    <Button isDisabled={isDisabled} isLoading={isLoading} onClick={onClick} h="90px">
      <HStack p="16px" rounded="12px" gap="16px" spacing="0" alignItems="flex-start" fontSize="14px" fontWeight="600">
        <Stack mt="3px">{leftIcon}</Stack>
        <Stack alignItems="flex-start" gap="10px" spacing="0">
          <Text fontSize="18px" fontWeight="500">
            {title}
          </Text>
          <Text fontSize="14px" fontWeight="400">
            {description}
          </Text>
        </Stack>
      </HStack>
    </Button>
  )
}
