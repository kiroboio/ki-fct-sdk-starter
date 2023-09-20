import {
  Button,
  Icon,
  Image,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Tooltip,
} from '@chakra-ui/react'
import { Image as ImageIcon } from 'react-feather'

interface ImagePopoverProps {
  src: string
  href: string
  title: string
  label: string
}

export const ImagePopover = ({ src, href, title, label }: ImagePopoverProps) => {
  return (
    <Popover arrowSize={10}>
      <PopoverTrigger>
        <Button size="0" bg="none" _hover={{ bg: 'none' }} color="white">
          <Tooltip placement="top" label={label} fontSize="md">
            <Icon boxSize="12px" mb="1px" as={ImageIcon} cursor="pointer" />
          </Tooltip>
        </Button>
      </PopoverTrigger>
      <PopoverContent rounded="xl" width="full" border="none">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>{title}</PopoverHeader>
        <PopoverBody>
          <Link href={href} isExternal>
            <Image rounded="xl" src={src} boxSize="200px" alt={title} />
          </Link>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
