//@ts-nocheck
import React, { useContext, useEffect, useRef } from 'react'
import { useColorMode } from '@chakra-ui/react'
import { TokenContext } from 'providers/Token'

let tvScriptLoadingPromise: Promise<any>

export default function TradingViewWidget() {
  const { colorMode, toggleColorMode } = useColorMode()
  const { inputToken, outputToken } = useContext(TokenContext)

  const onLoadScriptRef = useRef()

  useEffect(() => {
    onLoadScriptRef.current = createWidget

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement('script')
        script.id = 'tradingview-widget-loading-script'
        script.src = 'https://s3.tradingview.com/tv.js'
        script.type = 'text/javascript'
        script.onload = resolve

        document.head.appendChild(script)
      })
    }

    tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current())

    return () => (onLoadScriptRef.current = null)

    function createWidget() {
      if (document.getElementById('tradingview_7bd1a') && 'TradingView' in window) {
        new window.TradingView.widget({
          autosize: true,
          symbol: `${inputToken.symbol}${outputToken.symbol}`,
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: colorMode,
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: 'tradingview_7bd1a',
        })
      }
    }
  }, [inputToken, outputToken, colorMode])

  return <div id="tradingview_7bd1a" style={{ minWidth: '550px', height: '502px' }} />
}
