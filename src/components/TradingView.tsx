import React, { useEffect, useRef } from 'react'
import { useColorMode } from '@chakra-ui/react'
let tvScriptLoadingPromise: Promise<any>

export default function TradingViewWidget({ from, to }: { from?: string; to?: string }) {
  const { colorMode, toggleColorMode } = useColorMode()
  const onLoadScriptRef = useRef<(() => void) | null>()

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

    return () => {
      onLoadScriptRef.current = null
    }

    function createWidget() {
      if (document.getElementById('tradingview_7bd1a') && 'TradingView' in window) {
        new (window.TradingView as any).widget({
          autosize: true,
          symbol: `${from}${to}`,
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
  }, [from, to, colorMode])

  return <div id="tradingview_7bd1a" style={{ minWidth: '550px', height: '550px' }} />
}
