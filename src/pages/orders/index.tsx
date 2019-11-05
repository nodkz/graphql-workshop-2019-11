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

function OrderPagination() {
  const [perPage, setPerPage] = useState(10);

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
      variables: { page: 1, perPage },
      // fetchPolicy: 'cache-and-network',
      // notifyOnNetworkStatusChange: true,
    }
  );

  const total =
    (data && data.viewer && data.viewer.orderPagination && data.viewer.orderPagination.count) || 0;

  const [pagination, setPagination] = useState<PaginationConfig>({
    current: 1,
    total,
    showSizeChanger: true,
  });

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
        pagination={pagination}
        loading={loading}
        onChange={(pn) => {
          const pp = pn.pageSize || perPage;
          setPagination(pn);
          if (pp !== perPage) setPerPage(pp);
          refetch({ page: pn.current, perPage: pp });
        }}
      />
      <div>loading: {JSON.stringify(loading)}</div>
      <div>variables: {JSON.stringify(variables)}</div>
      <button onClick={() => refetch({ page: 1, perPage: 3 })}>Refetch</button>
    </>
  );
}

export default withApollo(OrderPagination);
