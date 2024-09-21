import { useState } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import DatePicker from "react-datepicker";
import { registerLocale } from 'react-datepicker';
import { enUS } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '../utils/mutations';
import Auth from '../utils/auth';

export default function Signup() {
  const styles = {
    background: {
        backgroundColor: 'var(--isabelline)',
        height: '100vh', // viewport height
        
    },
    container: {
      maxWidth: '600px',
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
    // Register datepicker locale
    registerLocale('en-US', enUS); 
    // Create instance of AntD form
    const [form] = Form.useForm();
 
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

    const [birthdate, setBirthdate] = useState(null);
    const [createUser, { error }] = useMutation(CREATE_USER);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState((prev) => ({ ...prev, [name]: value }))
    };
    // Handle date change
    const handleDateChange = (date) => {
      setBirthdate(date);
    };

    const handleFormSubmit = async (event) => {
      try {
        const finalValues = {
          ...formState,
          
          birthdate: birthdate,
        };
        console.log(formState);
        
        const { data } = await createUser({ variables: {...finalValues } });
        console.log(data);
        Auth.login(data.createUser.token);
      } catch (error) {
        console.error(error);
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
      <div style={styles.background}>
        <div style={styles.container}>
          <h2 style={styles.customHeading}>Get Started Today!</h2>
          <h3 style={styles.customHeading}> Make an account</h3>
          <div style={styles.formWrapper}>
          <Form
            name="signup"
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
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
                    selected={birthdate}
                    locale="en-US"
                    onChange={handleDateChange}
                    dateFormat="MM/dd/yyyy"
                    placeholderText='MM/DD/YYYY'
                    isClearable
                    showYearDropdown
                    yearDropdownItemNumber={75} // Number of years to show in dropdown year selector
                    scrollableYearDropdown
                  />
              </Form.Item>
    
            <Form.Item>
              <Button style={styles.btn} htmlType="submit" block >
                Submit
              </Button>
              </Form.Item>
          </Form>
          </div>
      </div>
      </div>  
    )
}