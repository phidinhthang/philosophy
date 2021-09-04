import React from 'react';
import { Wrapper, WrapperVariant } from '../ui/Wrapper';
import { NavBar } from './Navbar';

interface LayoutProps {
  variant?: WrapperVariant;
}

export const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
  return (
    <>
      <NavBar />
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};
