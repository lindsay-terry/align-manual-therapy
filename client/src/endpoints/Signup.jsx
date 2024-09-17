import { useState } from 'react';
import { Form, Input, Button, DatePicker, Row, Col } from 'antd';
import { useMutation } from '@apollo/client';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { CREATE_USER } from '../utils/mutations';
import Auth from '../utils/auth';

export default function Signup() {
    // Create instance of AntD form
    const [form] = Form.useForm();
    dayjs.extend(customParseFormat);

    // Handle getting phone value to format the way we need
    const [phoneValue, setPhoneValue] = useState('');
    const [formState, setFormState] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        birthdate: '',
    });
    const [createUser, { error, data }] = useMutation(CREATE_USER);

    const handleChange = (event) => {
        const { name, value } = event.target;
    
        setFormState({
          ...formState,
          [name]: value,
        });
    };
    // Handle date change on it's own for antd datepicker
    const handleDateChange = (date, dateString) => {
        setFormState((prevState) => ({
            ...prevState,
            birthdate: dateString,
        }));
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        console.log(formState);
        
        try {
            const { data } = await createUser({
            variables: { ...formState },
            });
        
            Auth.login(data.createUser.token);
        } catch (e) {
            console.error(e);
        }
    };

    // Function to format phone number using dashes
    const formatPhoneNumber = (value) => {
        // Remove all non-digit characters
        const cleaned = ('' + value).replace(/\D/g, '');
    
        // Check if the input length is valid for formatting
        if (cleaned.length > 10) return cleaned.slice(0, 10);
    
        // Format phone number
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
        if (match) {
        const [, g1, g2, g3] = match;
        return [g1, g2, g3].filter(Boolean).join('-');
        }
    
        return value;
    };

    // Updates the phone number to correct format as it is typed
    const handlePhoneChange = (e) => {
        const formattedPhone = formatPhoneNumber(e.target.value);
        setPhoneValue(formattedPhone);
        setFormState(prevState => ({
            ...prevState,
            phone: formattedPhone
          }));
        form.setFieldsValue({ phone: formattedPhone }); // Update the Form field
      };
      
      
    return (
        <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
        <h2>Sign Up</h2>
        <Form
          name="signup"
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true, message: 'Please input your first name!' }]}
              >
                <Input name="firstName" onChange={handleChange}/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true, message: 'Please input your last name!' }]}
              >
                <Input name="lastName" onChange={handleChange}/>
                </Form.Item>
            </Col>
          </Row>
  
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input name="email" onChange={handleChange}/>
            </Form.Item>
  
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' },
                // Validate password is between 8 and 24 characters
                {
                    min: 8,
                    max: 24,
                    message: 'Password must be between 8 and 24 characters.',
                },
            ]}
          >
            <Input.Password name="password" onChange={handleChange} />
            </Form.Item>

            {/* Confirm password  */}
            <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['password']}
            hasFeedback
            rules={[{ required: true, message: 'Please confirm your password.' },
                // Validate passwords match
                ({ getFieldValue }) => ({
                    validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error('The two passwords you have entered do not match.  Please try again.'));
                    }
                })
            ]}
          >
            <Input.Password name="confirmPassword"/>
            </Form.Item>
  
          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[{ required: true, message: 'Please input your phone number!' }]}
          >
            <Input 
                name="phone"
                value={phoneValue}
                onChange={handlePhoneChange}
                maxLength={12}
                />
            </Form.Item>
  
          <Form.Item
            label="Birthdate"
            name="birthdate"
            rules={[{ required: true, message: 'Please select your birthdate!' }]}
          >
                <DatePicker 
                format="MM-DD-YYYY"
                getValueProps={(value) => ({ value: value ? dayjs(value) : "" })}
                onChange={handleDateChange}
                />
            </Form.Item>
  
          <Form.Item>
            <Button type="primary" htmlType="submit" block onClick={handleFormSubmit}>
              Submit
            </Button>
            </Form.Item>
        </Form>
      </div>
    )
}