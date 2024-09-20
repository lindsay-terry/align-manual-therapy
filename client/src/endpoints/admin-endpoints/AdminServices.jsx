import { useQuery } from '@apollo/client';
import { QUERY_SERVICES } from '../../utils/queries';
import { useState } from 'react';
import { Card, Space, Row, Col, Button, Modal, Result } from 'antd';
import AdminEditServices from '../../components/AdminEditServices';
import Auth from '../../utils/auth';

export default function AdminServices() {
    // Security check to ensure only admins have access to this endpoint
    const allowed = Auth.loggedIn() && Auth.isAdmin();

    const styles={
        customCard: {
            width: '100%',
            marginTop: '10px',
            marginBottom: '5px',
            boxShadow: '0px 0px 1px var(--olive-2)',
        },
        spaceStyling: {
            backgroundColor: 'var(--isabelline)'
        },
        customBtn: {
            backgroundColor: 'var(--seasalt)',
            padding: '20px',
        },
    }

    // Query all services
    const { loading, data, error } = useQuery(QUERY_SERVICES);
    const services = data ? data.services : [];

    // States for displaying edit form and keeping track of selected service to edit
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    const handleClickEdit = (service) => {
        setSelectedService(service);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedService(null);
    };

    // Ensure user is authorized to view component
    if (!allowed) {
        return (
            <Result status="403" title="403" subTitle="Sorry, you don't have permission to access this page." />
        );
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;


    return (
        
        <Space direction="vertical" size="middle" style={styles.spaceStyling} >
            <Row gutter={[16, 16]} justify="start">
                {services.map((service) => (
                    <Col key={service._id} xs={24} sm={12}>
                        <Card title={service.name} style={styles.customCard}>
                            <ul>
                                <li>
                                   <p><b>Description:</b> {service.description}</p> 
                                </li>
                                {service.options.map((option, index) => (
                                    <li key={index}>
                                        <p><b>Price:</b> ${option.price}</p>
                                        <p><b>Duration:</b> {option.duration} minutes</p>
                                    </li>
                                ))}
                                <li><b>Cleanup:</b> {service.cleanup} minutes</li>
                            </ul>
                            <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
                                <Button style={styles.customBtn} onClick={() => handleClickEdit(service)}>Edit Service</Button>
                            </div>
                        </Card>
                    </Col>
                ))}
                {isModalVisible && selectedService && (
                    <Modal
                        title={`Edit ${selectedService.name}`}
                        open={isModalVisible}
                        onCancel={handleModalClose}
                        footer={null}
                    >
                        <AdminEditServices selectedService={selectedService} onClose={handleModalClose}/>
                    </Modal>
                )}
            </Row>
        </Space>
    )
}