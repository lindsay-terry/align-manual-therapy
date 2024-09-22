import { Modal, Button, Form, List, Typography, Input, notification, Popconfirm, Select } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_NOTE_TO_USER, DELETE_NOTE, UPDATE_USER_ROLE, DELETE_USER } from '../utils/mutations';

export default function AdminEditUser({showModal, editUser, handleCancel, updateUserNotes, refetch }) {
    // Destructure Option from antd select
    const { Option } = Select;

    const styles={
        buttonDiv: {
            display: 'flex',
            justifyContent: 'space-evenly',
            marginBottom: '10px',
        },
        cancelBtn: {
            backgroundColor: 'var(--bittersweet)',
            padding: '20px',
            color: 'var(--seasalt)',
        },
        confirmBtn: {
            backgroundColor: 'var(--olive-2)',
            color: 'var(--seasalt)',
            padding: '20px',
        },
        customBtn: {
            backgroundColor: 'var(--seasalt)',
            padding: '20px',
        }
    };
    
    // Initialize ant D form for use in edit user role
    const [form] = Form.useForm();

    const [noteContent, setNoteContent] = useState('');
    const [showNoteForm, setShowNoteForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    const [addNote] = useMutation(ADD_NOTE_TO_USER);
    const [deleteNote] = useMutation(DELETE_NOTE);
    const [updateUserRole] = useMutation(UPDATE_USER_ROLE);
    const [deleteUser] = useMutation(DELETE_USER);

    // Show note form when user clicks to add note
    const handleAddNote = () => {
        setShowNoteForm(true);
    };

    const handleClickEdit = () => {
        setShowEditForm(true);
    };

    // Function to edit user role
    const handleEditUser = async (values) => {
        try {
            await updateUserRole({
                variables: {
                    userId: editUser._id,
                    role: values.role,
                },
            });
            notification.success({
                message: 'Success',
                description: 'User role updated successfully',
            });
            refetch();
            setShowEditForm(false);
        } catch (error) {
            console.error('Error updating user role', error);
            notification.error({
                message: 'Error',
                description: `Failed to update user role: ${error.message}`,
            });
        }
    };

    // Function to handle deleting a user
    const handleDeleteUser = async () => {
        try {
            await deleteUser({
                variables: {
                    userId: editUser._id,
                },
            });
            notification.success({
                message: 'Success',
                description: 'User successfully deleted',
            });
            handleCancel();
            refetch();
        } catch (error) {
            console.error('Error deleting user', error);
            notification.error({
                message: 'Error',
                description: `Error deleting user, ${error.message}`,
            });
        }
    };

    // Add a note
    const handleNoteSubmit = async () => {
        try { 
            await addNote({
                variables: {
                    userId: editUser._id,
                    note: noteContent,
                },
            });
            updateUserNotes(noteContent);
            setNoteContent('');
            setShowNoteForm(false);
            

            notification.success({
                message: 'Success',
                description: 'Note added successfully',
            });

        } catch (error) {
            console.error('Error adding note', error);
            notification.error({
                message: 'Error',
                description: `Error adding note: ${error.message}`
            });
        }
    };

    // Delete a note
    const handleDeleteNote = async (note) => {
        try { await deleteNote({
            variables: {
                userId: editUser._id,
                note,
            },
        });
        } catch (error) {
            console.error('Error deleting note:', error);
        }
        updateUserNotes(null, note)
    };

    return (
    <div>
       <Modal
            title={`Edit ${editUser.firstName} ${editUser.lastName}`}
            open={showModal}
            onCancel={handleCancel}
            footer={[
                <div key="modal-footer">
                    <Button key='cancel' onClick={handleCancel} style={styles.cancelBtn}>Close</Button>
                </div>
                ]}
                
            >
            <div style={styles.buttonDiv}>
                <Button onClick={handleAddNote} style={styles.customBtn}>Add Note</Button>
                <Button onClick={handleClickEdit} style={styles.customBtn}>Edit User</Button>
                <Popconfirm
                    title="Delete?  This cannot be undone"
                    onConfirm={() => handleDeleteUser()}
                    okText='Yes'
                    cancelText='Actually, no'
                >
                    <Button style={styles.cancelBtn}>Delete Account <DeleteOutlined /></Button>
                </Popconfirm>
            </div>
            {/* Add note form  */}
            {showNoteForm &&
                <Form onFinish={handleNoteSubmit}>
                    <Form.Item>
                        <Input.TextArea
                            value={noteContent}
                            onChange={(event) => setNoteContent(event.target.value)}
                            rows={4}
                         />
                    </Form.Item>
                    <div style={styles.buttonDiv}>
                        <Button htmlType='submit' style={styles.confirmBtn}> Submit</Button>
                        <Button onClick={()=>{setShowNoteForm(false)}} style={styles.cancelBtn}>Cancel</Button>
                    </div>
                </Form>
            }

            {/* Edit access form  */}
            {showEditForm &&
                <Form form={form} onFinish={handleEditUser}>
                    <Form.Item
                        name='role'
                        lable='Access Level'
                        rules={[{ required: true, message: 'Please select an access level'}]}
                    >
                        <Select placeholder='Select access level'>
                            <Option value={0}>Basic</Option>
                            <Option value={1}>Admin</Option>
                        </Select>

                    </Form.Item>
                    <Form.Item>
                        <div style={styles.buttonDiv}>
                            <Button htmlType='submit' style={styles.confirmBtn}> Submit</Button>
                            <Button onClick={()=>{setShowEditForm(false)}} style={styles.cancelBtn}>Cancel</Button>
                        </div>
                    </Form.Item>
                </Form>
            }
            {/* View notes area */}
            <Typography.Title level={4}>Notes:</Typography.Title>
            <List
                bordered
                dataSource={editUser.notes}
                renderItem={item => (
                    <List.Item
                        key={item}
                        actions={[
                            <Popconfirm
                                title="Delete?  This cannot be undone"
                                onConfirm={() => handleDeleteNote(item)}
                                okText='Yes'
                                cancelText='Actually, no'
                            >
                                <DeleteOutlined style={{ color: 'var(--bittersweet)'}} />
                            </Popconfirm>
                        ]}>
                        <Typography.Text>{item}</Typography.Text>
                    </List.Item>
                )} 
            />
        </Modal>
    </div>
    )
}