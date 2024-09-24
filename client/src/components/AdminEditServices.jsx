import { Input, Space, Button, InputNumber, Form, notification } from 'antd';
import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_SERVICE } from '../utils/mutations';

export default function AdminEditServices({selectedService, onClose}) {
    // Destructure textArea from Ant D's input
    const { TextArea } = Input;

    const styles={
        saveBtn: {
            backgroundColor: 'var(--olive-2)',
            color: 'var(--seasalt)',
            padding: '20px',
        },
        optionsDiv: {
            borderBottom: '1px solid black',
            padding: '10px',
            margin: '10px',
            width: '75%',
        }

    }

    // Initialize form/Formdata
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        options: [],
    });

    const [updateService, { loading, error }] = useMutation(UPDATE_SERVICE);

    // Update the form data with all the information from the selectedService
    useEffect(() => {
        if (selectedService) {
            setFormData({
                name: selectedService.name,
                description: selectedService.description,
                options: selectedService.options.map(option => ({
                    price: option.price,
                    duration: option.duration,
                    cleanup: option.cleanup,
                })),
            });
        }
    }, [selectedService]);

    // Handle the changes in the options input fields
    const handleChangeOptions = (index, field, value) => {
        const newOptions = [...formData.options];
        newOptions[index][field] = value;
        setFormData({...formData, options: newOptions });
    };

    const handleSubmit = async () => {
        // Form data validation
        if (!formData.name || !formData.description || formData.options.length === 0){
            console.error('Form data is invalid:', formData);
            return;
        }
        // Ensure options have data
        for (let option of formData.options) {
            if (option.price <= 0 || option.duration <= 0 || option.cleanup <= 0) {
                console.error('Invalid option data:', option);
                return;
            }
        }

        try {
            const response = await updateService({
                variables: {
                    id: selectedService._id,
                    input: formData,
                },
            });
            notification.success({ message: 'Service updated successfully!' });
            onClose();
        } catch (error) {
            notification.error({ message: 'Service failed to update.', description: error.message });
            console.error('Error updating service:', error);
        }
    }

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <Form onFinish={handleSubmit}>
                <Form.Item label="Name" required>
                    <Input
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value })}
                    />
                </Form.Item>
                <Form.Item label="Description" required>
                    <TextArea
                        autoSize={true}
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value })}
                    />
                </Form.Item>
                {formData.options.map((option, index) => (
                    <Space
                        direction="vertical"
                        style={styles.optionsDiv}
                        key={index}
                    >
                        <Form.Item label="Duration" required>
                            <InputNumber
                                value={option.duration}
                                min={0}
                                onChange={(value) => handleChangeOptions(index, 'duration', value)}
                            />
                            <span> min</span>
                        </Form.Item>
                        <Form.Item label="Cleanup" required>
                            <InputNumber 
                                value={option.cleanup}
                                min={0}
                                onChange={(value) => handleChangeOptions(index, 'cleanup', value )}
                            />
                            <span> min</span>
                        </Form.Item>
                        <Form.Item label="$ Price" required>
                            <InputNumber
                                value={option.price}
                                min={0}
                                onChange={(value) => handleChangeOptions(index, 'price', value)}
                            />
                        </Form.Item>
                    </Space>
                ))}
                <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button style={styles.saveBtn} htmlType="submit">Save</Button>
                </Form.Item>
            </Form>
        </Space>
    )
}