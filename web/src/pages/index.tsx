import React from 'react';
import { useMeQuery } from '../generated/graphql';
import Layout from '../components/Layout';
import { withApollo } from '../lib/withApollo';

const HomePage = () => {
  const { data } = useMeQuery();
  if (!data) {
    return (
      <Layout>
        <div>Not logged in</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <div>users:</div>
        <ul>{data?.me ? <p>{data.me.name}</p> : <p>not login</p>}</ul>
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: true })(HomePage);
