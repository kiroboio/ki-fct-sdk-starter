import { ThemingProps } from '@chakra-ui/react'
import { mainnet, goerli, sepolia, arbitrum } from 'wagmi/chains'

export const KI_KEY = 'dev'
export const KI_SECRET = 'sdk'

export const SITE_NAME = 'Kirobo SDK starter kit'
export const SITE_DESCRIPTION = 'Quickly ship Web3 apps using Next.js and Kirobo FCTs ⚡'
export const SITE_URL = 'https://ki-fct-sdk-starter.vercel.app'

export const THEME_INITIAL_COLOR = 'system'
export const THEME_COLOR_SCHEME: ThemingProps['colorScheme'] = 'gray'
export const THEME_CONFIG = {
  initialColorMode: THEME_INITIAL_COLOR,
}

export const SOCIAL_TWITTER = 'kirobo_io'
export const SOCIAL_GITHUB = 'kiroboio/ki-fct-sdk-starter'

export const ETH_CHAINS = [mainnet, goerli, sepolia, arbitrum]

export const SERVER_SESSION_SETTINGS = {
  cookieName: SITE_NAME,
  password: process.env.SESSION_PASSWORD ?? 'UPDATE_TO_complex_password_at_least_32_characters_long',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}
