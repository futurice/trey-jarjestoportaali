import type React from 'react';
import styles from './Logincontainer.module.css';

interface ILoginContainer {
  children: React.ReactNode;
}

export const LoginContainer: React.FC<ILoginContainer> = ({ children }) => {
  return <div className={styles['login-container']}>{children}</div>;
};
