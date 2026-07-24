import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

// Cloudflare Turnstile explicit-render API. Only the bits we use are typed.
// https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/widget-configurations/
interface TurnstileApi {
  render: (
    el: HTMLElement,
    options: {
      sitekey: string
      callback: (token: string) => void
      'expired-callback'?: () => void
      'error-callback'?: () => void
      theme?: 'light' | 'dark' | 'auto'
      size?: 'normal' | 'compact' | 'flexible'
    }
  ) => string
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

export const TURNSTILE_SITE_KEY = import.meta.env
  .VITE_TURNSTILE_SITE_KEY as string | undefined

const SCRIPT_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

// Injects the Turnstile loader once (the backoffice has no shared <head> owner
// like the main app's root layout, so the widget loads its own script).
function ensureScript() {
  if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return
  const s = document.createElement('script')
  s.src = SCRIPT_SRC
  s.async = true
  s.defer = true
  document.head.appendChild(s)
}

interface TurnstileProps {
  // Called with a token on success, and with '' when it expires or errors.
  onVerify: (token: string) => void
  className?: string
}

// Renders a Cloudflare Turnstile widget for the login form. Renders nothing when
// no site key is configured (e.g. staging, where CAPTCHA is disabled), so the
// form can include it unconditionally.
export function Turnstile({ onVerify, className }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  const onVerifyRef = useRef(onVerify)
  onVerifyRef.current = onVerify

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return
    ensureScript()
    let cancelled = false

    const renderWidget = () => {
      if (
        cancelled ||
        widgetId.current ||
        !window.turnstile ||
        !containerRef.current
      ) {
        return
      }
      widgetId.current = window.turnstile.render(containerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: 'auto',
        size: 'flexible',
        callback: (token) => onVerifyRef.current(token),
        'expired-callback': () => onVerifyRef.current(''),
        'error-callback': () => onVerifyRef.current(''),
      })
    }

    // The script may still be loading; poll briefly until the global appears.
    const interval = setInterval(() => {
      if (window.turnstile) {
        clearInterval(interval)
        renderWidget()
      }
    }, 200)

    return () => {
      cancelled = true
      clearInterval(interval)
      if (widgetId.current) window.turnstile?.remove(widgetId.current)
    }
  }, [])

  if (!TURNSTILE_SITE_KEY) return null
  return <div ref={containerRef} className={cn('w-full', className)} />
}
