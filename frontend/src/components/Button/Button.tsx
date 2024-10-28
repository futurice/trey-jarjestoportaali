import React from "react"
import styles from "./Button.module.css"

export interface IButton extends React.PropsWithChildren {
  onClick?: () => void
  type?: "submit" | "button" | undefined
  variant: string
}
export const Button: React.FC<IButton> = ({ children, onClick, type, variant }) => {
  return (
    <button type={type} className={styles[variant]} onClick={onClick}>
      {children}
    </button>
  )
}
