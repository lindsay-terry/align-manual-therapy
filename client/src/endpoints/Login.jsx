import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Alert } from 'antd';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../utils/mutations';
import Auth from '../utils/auth';

export default function Login() {
    const styles = {
        background: {
            backgroundColor: 'var(--another-green)',
            height: '90vh', // viewport height
            
        },
        container: {
            maxWidth: '450px',
            margin: 'auto',
            padding: '20px',
        },
        formWrapper: {
            backgroundColor: 'var(--isabelline)', 
            borderRadius: '5%',
            padding: '20px',
            boxShadow: '0 2px 10px var(--black-olive)', 
        },
        btn: {
            color: 'var(--papaya-whip)',
            backgroundColor: 'var(--black-bean)',
        },
        customHeading: {
            display: 'flex',
            justifyContent: 'center',
        },
    };


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
        <div style={styles.background}>
        <div style={styles.container}>
            <h2 style={styles.customHeading}>Login</h2>
            <div style={styles.formWrapper}>
                
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