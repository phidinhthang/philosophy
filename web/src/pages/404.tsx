import Link from 'next/link';
import { Layout } from '../layouts/Layout';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Heading, Button } from '@chakra-ui/react';
import { withApollo } from '../lib/withApollo';

function NotFoundPage() {
  return (
    <Layout variant="regular">
      <Box
        display="flex"
        flexDir="column"
        justifyContent="center"
        alignItems="center"
        px="4"
      >
        <Heading color="red.600" mb="8">
          Rất tiếc, trang này không tồn tại!
        </Heading>
        <Link href="/">
          <Button leftIcon={<ArrowBackIcon />} size="lg">
            Trở lại trang chủ
          </Button>
        </Link>
      </Box>
    </Layout>
  );
}

export default withApollo()(NotFoundPage);
