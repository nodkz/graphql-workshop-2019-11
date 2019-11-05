import * as React from 'react';
import { withApollo } from 'app/lib/apollo.tsx';
import { useQuery } from '@apollo/react-hooks';
import {
  OrdersTestQuery as R,
  OrdersTestQueryVariables as V,
} from './__generated__/OrdersTestQuery';
import gql from 'graphql-tag';

function Home() {
  const { data, loading, error, networkStatus, refetch, client } = useQuery<R>(
    gql`
      query OrdersTestQuery($page: Int!, $perPage: Int) {
        viewer {
          category {
            description
            name
            productConnection(after: "123") {
              edges {
                node {
                  discontinued
                }
              }
            }
          }
          orderPagination(perPage: $perPage, page: $page, sort: ORDERID_ASC) {
            count
            items {
              orderID
              orderDate
              customerID
              employeeID
              employee {
                firstName
                lastName
                birthDate
              }
              customer {
                companyName
                orderList(limit: $perPage) {
                  orderID
                }
              }
              freight
            }
            pageInfo {
              pageCount
              currentPage
            }
          }
          regionList {
            name
          }
        }
      }
    `,
    {
      variables: { page: 1, perPage: 5 },
      // fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    }
  );
  return (
    <div>
      <button onClick={() => refetch()}>Refetch</button>
      <button onClick={() => client.clearStore()}>Clear store</button>
      <button onClick={() => client.resetStore()}>Reset store</button>

      <div>error: {JSON.stringify(error)}</div>

      <div>loading: {JSON.stringify(loading)}</div>

      {/* see https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/networkStatus.ts */}
      <div>networkStatus: {JSON.stringify(networkStatus)}</div>

      <div>data: {data && data.viewer && data.viewer.category && data.viewer.category.name}</div>
      <div>{JSON.stringify(data)}</div>
    </div>
  );
}

export default withApollo(Home);
