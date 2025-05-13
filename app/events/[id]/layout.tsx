import type React from "react"
import EmailModalWrapper from "./email-modal-wrapper"

export default function EventLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <EmailModalWrapper />
    </>
  )
}
