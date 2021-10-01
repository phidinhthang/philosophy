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
}

export const BackButton = ({ to = '/' }: BackButtonProps) => {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const { push } = useRouter();
  return (
    <>
      <Button onClick={onOpen} px="4" py="2" zIndex="10000">
        <ArrowBackIcon />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Test</ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
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
