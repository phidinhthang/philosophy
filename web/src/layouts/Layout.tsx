import React, { useEffect } from 'react';
import MediaQuery, { useMediaQuery } from 'react-responsive';
import { Wrapper, WrapperVariant } from '../ui/Wrapper';
import { NavBar } from './Navbar';
import { BottomNavigation } from './BottomNavigation';
import { Box } from '@chakra-ui/react';
import { useMeQuery } from '../generated/graphql';

interface LayoutProps {
  variant?: WrapperVariant;
}

export const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
  let isDeskTop = useMediaQuery({
    query: '(min-width: 480px)',
  });

  const { data } = useMeQuery();

  return (
    <>
      <Box display="flex" flexDirection="column" height="100vh">
        <NavBar />
        <Box overflowY="auto" flexGrow={1}>
          <Wrapper variant={variant}>{children}</Wrapper>
        </Box>
        {!isDeskTop && data?.me && <BottomNavigation />}
      </Box>
    </>
  );
};
