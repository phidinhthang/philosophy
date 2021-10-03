import { ArrowBackIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';

interface BackButtonProps {
  to?: string;
  children?: React.ReactNode;
  title?: string;
}

export const BackButton = ({
  to = '/',
  children,
  title = 'Trở lại trang chủ ?',
}: BackButtonProps) => {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const { push } = useRouter();
  return (
    <>
      <Button
        onClick={onOpen}
        px="4"
        py="2"
        zIndex="10000"
        leftIcon={<ArrowBackIcon />}
      >
        {children}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Test</ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Đóng
            </Button>
            <Button variant="ghost" onClick={() => push(`/${to}`)}>
              Ok
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
