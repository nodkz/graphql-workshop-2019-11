import * as React from 'react';
import { withApollo } from 'app/lib/apollo.tsx';
import { useApolloClient } from '@apollo/react-hooks';

function Home() {
  const client = useApolloClient();
  return <div>Order list mock page!!</div>;
}

export default withApollo(Home);
