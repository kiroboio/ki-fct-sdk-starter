import type { TextProps } from '@chakra-ui/react'
import { Text, Tooltip } from '@chakra-ui/react'

import { truncate } from '../utils/strings'

interface TextOrShortenedP extends TextProps {
  text: string
  maxLength: number
}

export const TextOrShortened = ({ text, maxLength, ...props }: TextOrShortenedP) => {
  return text.length <= maxLength ? (
    <Text {...props}>{text}</Text>
  ) : (
    <Tooltip placement="bottom-start" label={text} aria-label="A tooltip">
      <Text {...props}>{truncate(text, maxLength)}</Text>
    </Tooltip>
  )
}
