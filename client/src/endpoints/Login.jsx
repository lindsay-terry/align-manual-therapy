import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Alert, notification } from 'antd';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../utils/mutations';
import Auth from '../utils/auth';

export default function Login() {
    const styles = {
        background: {
            backgroundColor: 'var(--isabelline)',
            height: '70vh', // viewport height
            
        },
        container: {
            maxWidth: '450px',
            margin: 'auto',
            padding: '20px',
        },
        formWrapper: {
            backgroundColor: 'var(--seasalt)', 
            borderRadius: '5%',
            padding: '20px',
            boxShadow: '0 2px 7px var(--black-olive)', 
        },
        btn: {
            color: 'var(--seasalt)',
            backgroundColor: 'var(--olive-2)',
            padding: '20px'
        },
        customHeading: {
            display: 'flex',
            justifyContent: 'center',
        },
    };


    const [formState, setFormState] = useState({ email: '', password: '' });
    const [login, { error, data }] = useMutation(LOGIN);

    // Function to open error notification
    const openNotification = (message, description) => {
        notification.error({
          message,
          description,
          placement: 'topRight', 
        });
    };

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
        

        // Check for empty fields and show error notification
        if (!formState.email || !formState.password) {
            openNotification('Login Failed', 'Please fill in both email and password fields.');
            return;
        }
        try {
            const { data } = await login({
                variables: { ...formState },
            });
            Auth.login(data.login.token);
            
        } catch (e) {
            console.error(e);
            // Show notification on login failure
            openNotification('Login Failed', 'Invalid credentials. Please try again.');
        }
        // clear form values
        setFormState({
            email: '',
            password: '',
        });
    };
    return (
        <div style={styles.background}>
        <div style={styles.container}>
            <h2 style={styles.customHeading}>Login</h2>
            <div style={styles.formWrapper}>
                
                <Form
                    name="login"
                    layout="vertical"
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
                        <Button style={styles.btn} htmlType="submit" block onClick={handleFormSubmit}
                    >
                            Login
                        </Button>
                    </Form.Item>
                    <Link to='/signup'>
                    <Button style={styles.btn} block>
                            Need an account?  Sign up instead
                    </Button>
                    </Link>
                </Form>
            </div>
        </div>
        </div>
    )
}