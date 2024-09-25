import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SUBMIT_CONTACT } from '../utils/mutations';
import { Form, Input, Button, Alert } from 'antd';
import { Card, Typography, Space } from 'antd';
import MapComponent from '../components/Map';
import 'leaflet/dist/leaflet.css';

const { Title, Text } = Typography;

// The Contact component
export default function Contact() {

    const styles={
        container: {
            backgroundColor: 'var(--isabelline)',
        },
        customBtn: {
            backgroundColor: 'var(--olive-2)',
            color: 'var(--seasalt)',
            padding: '20px',
        },
    }

    // formData holds the name, email, and message input values
    // setFormData updates the state
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    // submitContact is the function used to trigger the mutation
    // data holds the response, loading is true when the mutation is in progress, and error holds any error that occurs
    const [submitContact, { data, loading, error }] = useMutation(SUBMIT_CONTACT);

    // Initialize the form
    const [form] = Form.useForm();

    // Function to handle input changes (when the user types into a form field)
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Function to handle form submission
    const handleSubmit = async () => {
        try {
            // Trigger the mutation with the form data as variables
            await submitContact({
                variables: { ...formData },
            });
            
            console.log('Form submitted successfully!');
            form.resetFields(); 
            setFormData({ name: '', email: '', message: '' }); 
        } catch (error) {
            console.error('Error submitting the form:', error);
        } 

    };

    return (
        <div style={styles.container}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
            <h2>How can we help?</h2>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter your name!' }]}
                >
                    <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                    />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Please enter your email!' },
                        {
                            pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                            message: 'Please enter a valid email address!'
                        }
                    ]}
                >
                    <Input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your Email"
                    />
                </Form.Item>
                <Form.Item
                    label="Message"
                    name="message"
                    rules={[{ required: true, message: 'Please enter your message!' }]}
                >
                    <Input.TextArea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Your Message"
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        style={styles.customBtn}
                        htmlType="submit"
                        loading={loading}
                        block
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </Button>
                </Form.Item>
            </Form>

            {error && (
                <Alert
                    message="Error"
                    description={error.message}
                    type="error"
                    showIcon
                    style={{ marginTop: '20px' }}
                />
            )}

            {data && (
                <Alert
                    message="Success"
                    description="Form submitted successfully!"
                    type="success"
                    showIcon
                    style={{ marginTop: '20px' }}
                />
            )}
            </div>

            <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
                <Title level={2}>Contact Us</Title>
                <Card bordered={true} style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        {[
                            { label: 'Phone Number', value: '(801) 867-4354' },
                            { label: 'Address', value: '225 N Bluff St, Suite #23, St. George UT 84770' },
                            { label: 'Email', value: 'ryan@alignmtherapy.com' },
                        ].map(({ label, value }) => (
                            <Space
                                key={label}
                                direction="horizontal"
                                size="large"
                                style={{
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    padding: '5px',
                                    flexWrap: 'wrap', 
                                }}
                            >
                                <Text strong style={{ flex: 1 }}>{label}</Text>
                                <Text style={{ flex: 2 }}>{value}</Text>
                            </Space>
                        ))}
                    </Space>
                </Card>
            </Space>
            <MapComponent />
            <div style={{ marginBottom: '40px' }}></div>
        </div>
    );
}