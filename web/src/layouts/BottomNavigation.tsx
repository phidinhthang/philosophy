import {
  Box,
  ButtonGroup,
  Button,
  ButtonProps,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  AiFillHome,
  AiOutlineHome,
  AiFillSave,
  AiOutlineSave,
} from 'react-icons/ai';
import {
  MdAccountCircle,
  MdOutlineAccountCircle,
  MdLeaderboard,
  MdOutlineLeaderboard,
} from 'react-icons/md';

import { useRouter } from 'next/router';
import Link from 'next/link';
import * as React from 'react';

const BottomNavigationItem = ({
  Icon,
  ActiveIcon,
  href,
  ...props
}: {
  Icon: React.ReactElement;
  ActiveIcon: React.ReactElement;
  href: string;
} & ButtonProps) => {
  const { asPath } = useRouter();
  console.log(asPath);
  const active = asPath === href;

  return (
    <Link href={href}>
      <Button {...props} flexGrow={1} borderRadius={0} fontSize="24px">
        {active ? ActiveIcon : Icon}
      </Button>
    </Link>
  );
};

export const BottomNavigation = () => {
  const { asPath } = useRouter();
  return (
    <Box position="relative" bottom={0} width="full">
      <ButtonGroup
        display="flex"
        width="full"
        size="lg"
        spacing={0}
        colorScheme={useColorModeValue('twitter', 'gray')}
      >
        <BottomNavigationItem
          href="/"
          Icon={<AiOutlineHome />}
          ActiveIcon={<AiFillHome />}
        />
        <BottomNavigationItem
          href="/profile"
          ActiveIcon={<MdAccountCircle />}
          Icon={<MdOutlineAccountCircle />}
        />
        <BottomNavigationItem
          href="/rank"
          Icon={<MdOutlineLeaderboard />}
          ActiveIcon={<MdLeaderboard />}
        />
        <BottomNavigationItem
          href="/saved"
          Icon={<AiOutlineSave />}
          ActiveIcon={<AiFillSave />}
        />
      </ButtonGroup>
    </Box>
  );
};
