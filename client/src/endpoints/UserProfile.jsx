import { useState } from 'react';
import { Descriptions, Row, Col, Button, Result } from 'antd';
import UserEditProfile from '../components/UserEditProfile';
import AppointmentCards from '../components/AppointmentCards';
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import Auth from '../utils/auth';
import dayjs from 'dayjs';

export default function UserProfile() {
    const styles ={
        customImg: {
            maxHeight: '200px'
        },
        container: {
            backgroundColor: 'var(--isabelline)',
            minHeight: '70vh',
        },
        chart: {
            backgroundColor: 'var(--seasalt)',
        },
        customHeader: {
            margin: '0px',
            padding: '20px',
        },
        payButton: {
            padding: '20px',
            marginTop: '10px'
        },
        editButton: {
            marginTop: '20px',
            padding: '20px'
        }
    }

    const { loading, error, data, refetch } = useQuery(QUERY_ME);
    // Toggle edit mode
    const [isEditing, setIsEditing] = useState(false); 

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const userData = data?.me || {};
    const formattedDOB = userData.birthdate ? dayjs(userData.birthdate).format('MM/DD/YYYY') : 'N/A';

    const toggleEditMode = () => setIsEditing(!isEditing);

    // Verify user is logged in and if not, display please log in error
    if (!Auth.loggedIn()) {
        return (
            <Result status="404" title='Please log in:' subTitle="Sorry, you must be logged in to view your profile!" />
        )
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.customHeader}>Welcome {userData.firstName}!</h1>
            <Row gutter={16}>
                <Col xs={24} sm={12}>
                    {isEditing ? (
                        <UserEditProfile userData={userData} toggleEditMode={toggleEditMode} />
                    ) : (
                        <Descriptions title="User Information" bordered column={1}>
                            <Descriptions.Item label="Name">
                                {userData.firstName} {userData.lastName}
                            </Descriptions.Item>
                            <Descriptions.Item label="Phone">{userData.phone}</Descriptions.Item>
                            <Descriptions.Item label="Email">{userData.email}</Descriptions.Item>
                            <Descriptions.Item label="DOB">{formattedDOB}</Descriptions.Item>
                        </Descriptions>
                    )}

                    {!isEditing && (
                        <Button onClick={toggleEditMode} style={styles.editButton}>
                            Edit Profile
                        </Button>
                    )}
                </Col>
                <Col xs={24} sm={12}>
                    <AppointmentCards userData={userData} refetch={refetch} />
                </Col>
            </Row>
        </div>
    );
}
