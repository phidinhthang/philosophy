import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useLoginMutation, MeQuery, MeDocument } from '../generated/graphql';
import { setAccessToken } from '../lib/accessToken';
import Router from 'next/router';
import { withApollo } from '../lib/withApollo';

const LoginPage = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [login] = useLoginMutation();

  return (
    <Layout>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          console.log('form submitted');
          const response = await login({
            variables: {
              name,
              password,
            },
            update: (store, { data }) => {
              if (!data) {
                return null;
              }

              store.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  me: data.login.user,
                },
              });
            },
          });

          console.log(response);

          if (response && response.data && response.data.login.accessToken) {
            setAccessToken(response.data.login.accessToken);
          }

          Router.push('/');
        }}
      >
        <div>
          <input
            value={name}
            placeholder="name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            placeholder="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </Layout>
  );
};
export default withApollo({ ssr: false })(LoginPage);
