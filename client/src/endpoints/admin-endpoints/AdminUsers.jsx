import { useQuery } from '@apollo/client';
import { QUERY_USERS } from '../../utils/queries';
import AdminEditUser from '../../components/AdminEditUser';
import { useState } from 'react';
import { Result, Row, Col, Table } from 'antd';
import Auth from '../../utils/auth';
import dayjs from 'dayjs';

export default function AdminUsers() {

    const styles={
        container: {
            backgroundColor: 'var(--isabelline)',
            minHeight: '70vh',
        },
        customBtn: {
            backgroundColor: 'var(--seasalt)',
            padding: '20px',
        },
        instructions: {
            padding: '20px',
            fontSize: '150%'
        }
    }

    // Security check to ensure only admins have access to this endpoint
    const allowed = Auth.loggedIn() && Auth.isAdmin();

    // Query all services
    const { loading, data, error, refetch } = useQuery(QUERY_USERS);
    const users = data ? data.users : [];

    const [editUser, setEditUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const columns = [
        {
            title: 'Name',
            key: 'name',
            render: (text, record) => `${record.firstName} ${record.lastName}`,
        },
        {
            title: 'Phone Number',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Email Address',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Birthdate',
            render: (text, record) => `${dayjs(record.birthdate).format('MM/DD/YYYY')}`,
            key: 'birthdate',
        },
        {
            title: 'Access Level',
            render: (text, record) => {
                if (record.role === 0) {
                    return <span>Basic</span>
                } else if (record.role === 1) {
                    return <span>Admin</span>
                }
            },
            key: 'role',
        },
    ];

    // Clicking on a user
    const handleRowSelect = (record) => {
        setEditUser(record);
        setShowModal(true);
    }

    // Close modal
    const handleCancel = () => {
        setShowModal(false);
    }

    //Immediately update the user's notes in modal for add or deletion
    const updateUserNotes = (newNote, deletedNote) => {
        setEditUser(prev => {
            const updatedNotes = deletedNote 
                ? prev.notes.filter(note => note !== deletedNote) 
                : [...prev.notes, newNote];
            
            return {
                ...prev,
                notes: updatedNotes,
            };
        });
    };

    // Ensure user is authorized to view component
    if (!allowed) {
        return (
            <Result status="403" title="403" subTitle="Sorry, you don't have permission to access this page." />
        );
    }
    return (
        <div style={styles.container}>
            <Table dataSource={users} columns={columns} rowKey='_id' pagination={{ pageSize: 8 }} scroll={{ x: 'max-content' }}
                // Adds event listneer to each row to update user
                onRow={(record) => ({
                    onClick: () => handleRowSelect(record),
                    onMouseEnter: ((event) => (event.currentTarget.style.cursor = 'pointer'))
                })}/>
            {showModal && editUser && (
             <AdminEditUser showModal={showModal} editUser={editUser} setShowModal={setShowModal} handleCancel={handleCancel} updateUserNotes={updateUserNotes} refetch={refetch} />
            )}
        </div>
    )
}