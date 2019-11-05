import { useState } from 'react';
import { Table } from 'antd';
import { PaginationConfig } from 'antd/lib/pagination';
import { withApollo } from 'app/lib/apollo.tsx';
import { useQuery } from '@apollo/react-hooks';
import {
  OrdersTestQuery as R,
  OrdersTestQueryVariables as V,
} from './__generated__/OrdersTestQuery';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';

function OrderPagination() {
  const router = useRouter();

  const page = typeof router.query.page === 'string' ? parseInt(router.query.page, 10) : 1;
  const setPage = (page: number) => {
    router.push({ pathname: router.pathname, query: { ...router.query, page } });
  };

  const perPage =
    typeof router.query.perPage === 'string' ? parseInt(router.query.perPage, 10) : 10;
  const setPerPage = (perPage: number) => {
    router.push({ pathname: router.pathname, query: { ...router.query, perPage } });
  };

  const { data, loading, error, networkStatus, variables, refetch, client, updateQuery } = useQuery<
    R
  >(
    gql`
      query OrdersTestQuery($page: Int!, $perPage: Int) {
        viewer {
          category {
            description
            name
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
      variables: { page, perPage },
      fetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: false,
    }
  );

  const total =
    (data && data.viewer && data.viewer.orderPagination && data.viewer.orderPagination.count) || 0;

  const items =
    data && data.viewer && data.viewer.orderPagination && data.viewer.orderPagination.items
      ? data.viewer.orderPagination.items
      : [];

  return (
    <>
      <Table
        columns={[
          {
            title: 'Order ID',
            dataIndex: 'orderID',
          },
          {
            title: 'Date',
            dataIndex: 'orderDate',
          },
          {
            title: 'Customer',
            dataIndex: 'customer.companyName',
          },
          {
            title: 'Employee',
            dataIndex: 'employee',
            render: (e) => `${e.firstName} ${e.lastName}`,
          },
        ]}
        rowKey={(record) => `${record && record.orderID}`}
        dataSource={items}
        pagination={{
          current: page,
          pageSize: perPage,
          total,
          showSizeChanger: true,
        }}
        loading={loading}
        onChange={(pn) => {
          if (pn.pageSize && pn.pageSize !== perPage) setPerPage(pn.pageSize);
          if (pn.current && pn.current !== page) setPage(pn.current);
        }}
      />
      <div>loading: {JSON.stringify(loading)}</div>
      <div>variables: {JSON.stringify(variables)}</div>
      <button onClick={() => refetch({ page: 1, perPage: 3 })}>Refetch</button>
    </>
  );
}

export default withApollo(OrderPagination);
