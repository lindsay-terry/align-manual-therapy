import { useState } from 'react';
import { Descriptions, Row, Col, Card, Button } from 'antd';
import UserEditProfile from '../components/UserEditProfile'; // Import the new component
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import dayjs from 'dayjs';

export default function UserProfile() {
    const { loading, error, data } = useQuery(QUERY_ME);
    const [isEditing, setIsEditing] = useState(false); // Toggle edit mode

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const userData = data?.me || {};
    const formattedDOB = userData.birthdate ? dayjs(userData.birthdate).format('MM/DD/YYYY') : 'N/A';

    const toggleEditMode = () => setIsEditing(!isEditing);

    return (
        <div>
            <h1>Welcome {userData.firstName}!</h1>
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
                        <Button type="primary" onClick={toggleEditMode} style={{ marginTop: '20px' }}>
                            Edit Profile
                        </Button>
                    )}
                </Col>
                {/* You can include the appointments or other information in another column if necessary */}
            </Row>
        </div>
    );
}
