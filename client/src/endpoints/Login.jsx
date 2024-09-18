import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Typography, Alert } from 'antd';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../utils/mutations';
import Auth from '../utils/auth';

export default function Login() {
    const { Title } = Typography;
    const [formState, setFormState] = useState({ email: '', password: '' });
    const [login, { error, data }] = useMutation(LOGIN);
    // update state based on form input changes
    const handleChange = (event) => {
    const { name, value } = event.target;
        setFormState({
            ...formState,
            [name]: value,
        });
    };
    // submit form
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        console.log(formState);
        try {
            const { data } = await login({
                variables: { ...formState },
            });
            Auth.login(data.login.token);
            console.log('DATA_LOGIN_TOKEN', data.login.token);
        } catch (e) {
            console.error(e);
        }
        // clear form values
        setFormState({
            email: '',
            password: '',
        });
    };
    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
            <Title level={2}>Login</Title>
            {error && (
                <Alert
                    message="Login Error"
                    description="There was an error logging in. Please check your credentials and try again."
                    type="error"
                    showIcon
                />
            )}
            <Form
                name="login"
                layout="vertical"
                // onSubmit={handleFormSubmit}
                initialValues={formState}
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
                >
                    <Input name="email" onChange={handleChange} />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password name="password" onChange={handleChange} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block onClick={handleFormSubmit}
                >
                        Login
                    </Button>
                </Form.Item>
                <Link to='/signup'>
                <Button type="primary" block>
                        Need an account?  Sign up instead
                </Button>
                </Link>
            </Form>
        </div>
    )
}