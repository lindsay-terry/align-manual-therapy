import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { UPDATE_USER } from '../utils/mutations';
import { Button, Input, Form } from 'antd';

export default function UserEditProfile({ userData, toggleEditMode }) {
    const [form] = Form.useForm();
    const [updateUser, { loading, error }] = useMutation(UPDATE_USER);
    
    // Initial form values from userData
    const [userDetails, setUserDetails] = useState({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        birthdate: userData.birthdate
    });

    const handleFormChange = (changedValues) => {
        setUserDetails(prevState => ({
            ...prevState,
            ...changedValues
        }));
    };

    const handleFormSubmit = async () => {
        try {
            const { firstName, lastName, email, phone, birthdate } = userDetails;
            await updateUser({
                variables: {
                    id: userData._id,
                    input: {
                        firstName,
                        lastName,
                        email,
                        phone,
                        birthdate
                    }
                }
            });
            toggleEditMode();
        } catch (err) {
            console.error('Error updating profile:', err);
        }
    };

    return (
        <Form
            form={form}
            initialValues={userDetails}
            onValuesChange={handleFormChange}
            onFinish={handleFormSubmit}
        >
            <Form.Item label="First Name" name="firstName">
                <Input placeholder="First Name" />
            </Form.Item>
            <Form.Item label="Last Name" name="lastName">
                <Input placeholder="Last Name" />
            </Form.Item>
            <Form.Item label="Email" name="email">
                <Input placeholder="Email" />
            </Form.Item>
            <Form.Item label="Phone" name="phone">
                <Input placeholder="Phone" />
            </Form.Item>
            <Form.Item label="Birthdate" name="birthdate">
                <Input placeholder="Birthdate" />
            </Form.Item>

            {error && <p>Error updating user: {error.message}</p>}

            <Button type="primary" htmlType="submit" loading={loading}>
                Save Changes
            </Button>
            <Button onClick={toggleEditMode} style={{ marginLeft: '8px' }}>
                Cancel
            </Button>
        </Form>
    );
}