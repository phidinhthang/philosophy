import * as React from 'react';
import { useRouter } from 'next/router';
import { useConfirmEmailMutation } from '../../generated/graphql';
import { Wrapper } from '../../ui/Wrapper';
import { withApollo } from '../../lib/withApollo';

const ConfirmEmail = () => {
  const [confirmEmail, { error, loading, data }] = useConfirmEmailMutation();
  const router = useRouter();
  const [] = React.useState();
  React.useEffect(() => {
    console.log(router.query);
    confirmEmail({
      variables: {
        token: typeof router.query.token === 'string' ? router.query.token : '',
      },
    });
  }, [router, confirmEmail]);
  return (
    <Wrapper>
      {loading ? (
        <p>loading...</p>
      ) : !loading && data ? (
        <p>Cập nhật email thành công</p>
      ) : (
        <p>: Có lỗi xảy ra. </p>
      )}
    </Wrapper>
  );
};

export default withApollo()(ConfirmEmail);
