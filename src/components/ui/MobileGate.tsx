import {type ReactNode, useEffect } from 'react'

const PORTFOLIO_URL = 'https://dtcoops.github.io/portfolio/'

export default function MobileGate({ children }: { children: ReactNode }) {
  const isMobile = window.innerWidth < 768

  useEffect(() => {
    if (isMobile) {
      window.location.href = PORTFOLIO_URL
    }
  }, [isMobile])

  if (isMobile) return null
  return (
    <>
    {children}
    </>
  )
}

export { MobileGate }