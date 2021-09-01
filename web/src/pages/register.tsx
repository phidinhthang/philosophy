import React, { useState } from 'react';
import { useRegisterMutation } from '../generated/graphql';
import Layout from '../components/Layout';
import Router from 'next/router';
import { withApollo } from '../lib/withApollo';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [register] = useRegisterMutation();

  return (
    <Layout>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          console.log('form submitted');
          const response = await register({
            variables: {
              name,
              password,
            },
          });

          console.log(response);

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
        <button type="submit">register</button>
      </form>
    </Layout>
  );
};

export default withApollo({ ssr: false })(RegisterPage);
