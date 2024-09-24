import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_CONTACTS } from '../../utils/queries';
import { Table, Spin, Alert } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export default function ViewContacts() {
  // Use Apollo's useQuery hook to fetch the contacts
  const { loading, error, data } = useQuery(GET_CONTACTS);

  // Define columns for the Ant Design Table component
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: 'Submitted At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => dayjs.utc(createdAt).local().format('MMMM D, YYYY h:mm A'),
    },
  ];

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  // Show error message if there’s an issue with the query
  if (error) {
    return (
      <Alert
        message="Error"
        description={`Error fetching contacts: ${error.message}`}
        type="error"
        showIcon
      />
    );
  }

  // Display the list of contacts in a table once the data is available
  return (
    <div style={{ padding: '20px' }}>
      <h2>Submitted Contact Forms</h2>
      <Table
        columns={columns}
        dataSource={data.getContacts}
        rowKey={(record) => record.email} // You can use a unique field like email as the row key
        bordered
      />
    </div>
  );
}