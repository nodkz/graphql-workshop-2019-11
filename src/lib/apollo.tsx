import React from 'react';
import Head from 'next/head';
import { NextComponentType, NextPageContext } from 'next';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import getConfig from 'next/config';
import fetch from 'isomorphic-unfetch';

const { publicRuntimeConfig = {} } = getConfig() as any;
const { REACT_APP_GRAPHQL_URI } = publicRuntimeConfig as any;

interface WithApolloProps {
  apolloClient: ApolloClient<any> | null;
  apolloState: any;
  [key: string]: any;
}

export interface WithApolloContext extends NextPageContext {
  apolloClient: ApolloClient<any>;
}

export function withApollo(PageComponent: NextComponentType<any, any, any>, { ssr = true } = {}) {
  const WithApollo = ({ apolloClient, apolloState, ...pageProps }: WithApolloProps) => {
    const client = apolloClient || initApolloClient(apolloState);
    return (
      <ApolloProvider client={client}>
        <PageComponent {...pageProps} />
      </ApolloProvider>
    );
  };

  // Set the correct displayName in development
  if (process.env.NODE_ENV !== 'production') {
    const displayName = PageComponent.displayName || PageComponent.name || 'Component';
    if (displayName === 'App') {
      console.warn('This withApollo HOC only works with PageComponents.');
    }
    WithApollo.displayName = `withApollo(${displayName})`;
  }

  if (ssr || PageComponent.getInitialProps) {
    WithApollo.getInitialProps = async (ctx: WithApolloContext) => {
      const { AppTree, req, res } = ctx;

      const fetchOptions: any = {};

      if (req) {
        const cookie = req.headers['cookie'];
        const origin = req.headers['origin'];
        fetchOptions.headers = { cookie, origin };
      }

      // Initialize ApolloClient, add it to the ctx object so
      // we can use it in `PageComponent.getInitialProp`.
      const apolloClient = (ctx.apolloClient = initApolloClient({}, fetchOptions));

      // Run wrapped getInitialProps methods
      let pageProps = {};
      if (PageComponent.getInitialProps) {
        pageProps = await PageComponent.getInitialProps(ctx);
      }

      // Only on the server:
      if (typeof window === 'undefined') {
        if (res && res.finished) {
          return pageProps;
        }

        if (ssr) {
          try {
            // Run all GraphQL queries
            const { getDataFromTree } = await import('@apollo/react-ssr');
            await getDataFromTree(
              <AppTree
                pageProps={{
                  ...pageProps,
                  apolloClient,
                }}
              />
            );
          } catch (error) {
            console.error('Error while running `getDataFromTree`', error);
          }

          // getDataFromTree does not call componentWillUnmount
          // head side effect therefore need to be cleared manually
          Head.rewind();
        }
      }

      const apolloState = apolloClient.cache.extract();

      return {
        ...pageProps,
        apolloState,
      };
    };
  }

  return WithApollo;
}

let apolloClientInBrowser: ApolloClient<any> | null = null;

function initApolloClient(initialState: any = {}, fetchOptions: any = {}) {
  if (typeof window === 'undefined') {
    return createApolloClient(initialState, fetchOptions);
  }

  if (!apolloClientInBrowser) {
    apolloClientInBrowser = createApolloClient(initialState);
  }

  return apolloClientInBrowser;
}

function createApolloClient(initialState = {}, { headers }: any = {}) {
  const linkOptions: HttpLink.Options = {
    uri: REACT_APP_GRAPHQL_URI,
    credentials: 'include',
    fetch,
  };

  if (headers) linkOptions.headers = headers;

  const link = new HttpLink(linkOptions);

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link,
    cache: new InMemoryCache().restore(initialState),
  });
}
