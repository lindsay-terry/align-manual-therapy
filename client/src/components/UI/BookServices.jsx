import { Form, Radio, Card, Collapse, Button } from 'antd';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QUERY_SERVICES } from '../../utils/queries';
import { useQuery } from '@apollo/client';
import BookingCalendar  from './BookingCalendar';
import Auth from '../../utils/auth';

export default function BookServices() {
    const styles={
        nextBtn: {
            borderColor: 'var(--black-bean)',
            color: 'var(--papaya-whip)',
            backgroundColor: 'var(--asparagus-2)',
        },
        container: {
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            margin: '25px',
            backgroundColor: 'var(--isabelline)',
            boxShadow: '0 1px 10px var(--black-olive)',
            maxWidth: '450px',
            borderRadius: '5%'
        },
        customPanel: {
            maxWidth: '400px',
        },
        customCard: {
            margin: '10px',
            maxWidth: '300px',
        },
        description: {
            border: '1px solid var(--black-olive)',
            borderRadius: '5%',
            padding: '10px',
        },
        radio: {
            display: 'flex',
            justifyContent: 'center',
            border: '1px solid var(--black-olive)',
            borderRadius: '10px',
            margin: '5px',
        }
    }

    // Query all services
    const { loading, data } = useQuery(QUERY_SERVICES);
    const services = data ? data.services : [];
    // State to manage value selected from radio input form
    const [selectedValue, setSelectedValue] = useState(null);
    // State to manage if form or calendar is visible
    const [showCalendar, setShowCalendar] = useState(false);

    // Update the state on change and on page load
    useEffect(() => {
        if (selectedValue) {
            console.log('Selected value has updated');
            console.log(selectedValue);
        }
    }, [selectedValue]);

    const handleChange = (event) => {
        const { value } = event.target;
        const [serviceName, duration] = value.split('-');
        const selectedService = services.find(service => service.name === serviceName);
        
        const option = selectedService.options.find(option => option.duration.toString() === duration);

        if (selectedService && option) {
            const serviceData = {
                id: selectedService._id,
                name: selectedService.name,
                duration: option.duration,
                price: option.price,
            };
            setSelectedValue(serviceData);
        }
    }

    const handleSubmit = (event) => {
        if (selectedValue) {
            setShowCalendar(true);
        }
    };

    // Accordion/collapse of services
    const collapseItems = services.map((service) => ({
        key: service._id,
        label: <span style={{ fontWeight: 'bold', padding: '10px' }}>{service.name}</span>,
        children: (
            <Card size='default' style={styles.customCard}>
                <p style={styles.description}>{service.description}</p>
                {service.options.map((option, index) => (
                    <Radio style={styles.radio} key={index} value={`${service.name}-${option.duration}`} >
                        <p>Duration: {option.duration} minutes</p>
                        <p>Price: ${option.price}</p>
                    </Radio>
                ))}
            </Card>
        )
    }));

    return (
        <div>
            {/* Show calendar based on state determined by handleSubmit function */}
            {!showCalendar ? (
        <Form style={styles.container}>
                <Radio.Group onChange={handleChange}>
                    <Collapse accordion={true} items={collapseItems} style={styles.customPanel} />
                </Radio.Group>
            {Auth.loggedIn()? (
            <Button block={true} disabled={!selectedValue} style={styles.nextBtn} onClick={handleSubmit}>Next</Button>
            ) : (
                <div>
                    <p>Must be logged in to book services.</p>
                    <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
                        <Link to='/signup'>
                            <Button style={styles.nextBtn}>Sign up</Button>
                        </Link>
                        <Link to='/login'>
                            <Button style={styles.nextBtn}>Log In</Button>
                        </Link>
                    </div>
                </div>
            )}
        </Form>
        ) : (
            // Pass user selection as props to calendar
        <BookingCalendar selectedValue={selectedValue}/>
        )}
        </div>
    )
};