import React, { useState, useEffect } from 'react';
import { Calendar, Views, dayjsLocalizer } from 'react-big-calendar';
import { useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { QUERY_APPOINTMENTS } from '../utils/queries';
import { Modal, Button } from 'antd';
import Payment from './Payment.jsx';

// Initialize localizer
const localizer = dayjsLocalizer(dayjs);

export default function AdminCalendarSetup() {
    const [view, setView] = useState(Views.WEEK);
    const [modalOpen, setModalOpen] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    // Define working hours example (10:00 AM to 6:15 PM)
    const workStartTime = new Date();
    workStartTime.setHours(10, 0, 0);
    const workEndTime = new Date();
    workEndTime.setHours(18, 15, 0);

    // Fetch appointments from GraphQL - Always fetch from network not cached value
    const { loading, error, data } = useQuery(QUERY_APPOINTMENTS, {
        fetchPolicy: "network-only"
    }); 

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error fetching appointments.</p>;

    // useEffect(() => {
    //     if (data?.appointments) {
    //         const updatedShowPayment = {};
    //         data.appointments.forEach(appointment => {
    //             if (appointment.isPaid) {
    //                 updatedShowPayment[appointment._id] = false;
    //             } else {
    //                 updatedShowPayment[appointment_id] = showPayment[appointment._id] || false
    //             }
    //         });
    //         setShowPayment(updatedShowPayment)
    //     }
    // }, [data?.appointments])

    // Helper function to parse "HH:MM AM/PM" format
    const parseTime = (date, time) => {
        const [timeString, modifier] = time.split(' '); // Split time and AM/PM
        let [hours, minutes] = timeString.split(':').map(Number);

        // Convert to 24-hour format
        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        // Return new Date object with parsed time
        const parsedDate = new Date(date);
        parsedDate.setHours(hours, minutes);
        return parsedDate;
    };

    // Transform appointments data into the format expected by React Big Calendar
    const events = data?.appointments.map((appointment) => {
        const start = parseTime(appointment.date, appointment.time); // Parse date and time
    
        // Total duration = appointment duration + service cleanup (both in minutes)
        const totalDuration = appointment.duration + appointment.service.cleanup;
    
        // Calculate the end time by adding total duration to start time
        const end = new Date(start.getTime() + totalDuration * 60000); // Convert to milliseconds
    
        return {
        title: `${appointment.duration} ${appointment.service.name}\n${appointment.user.firstName} ${appointment.user.lastName}`,
        start: start,
        end: end,
        allDay: false,
        appointment: {
            ...appointment, // Include the whole appointment object
            start, // Include start time
            end // Include end time
        },
        };
    });

    const formatTime = (date) => {
        const options = { hour: 'numeric', minute: '2-digit', hour12: true };
        return date.toLocaleTimeString([], options).replace(/^0/, ''); // Remove leading zero
    };

    const handleSelectEvent = (event) => {
        setSelectedAppointment(event.appointment); // Store the selected appointment
        setModalOpen(true); // Open the modal
    };

    const handleCloseModal = () => {
        setModalOpen(false); // Close the modal
        setSelectedAppointment(null); // Clear selected appointment
    };

    return (
        <div>
        <Calendar
            min={workStartTime} // Set start time to 10:00 AM
            max={workEndTime} // Set end time to 6:15 PM
            localizer={localizer}
            events={events} // Pass the transformed events
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500, margin: '50px' }}
            defaultView={view}
            onView={(newView) => setView(newView)} // Handle view changes
            eventPropGetter={() => ({
                style: { whiteSpace: 'pre-wrap' }, // Allow line breaks in event titles
            })}
            onSelectEvent={handleSelectEvent} // Add event handler for selecting events
        />
        <Modal
            title="Appointment Details"
            open={modalOpen}
            onCancel={handleCloseModal}
            footer={[
                <Button.Group key="buttons" style={{ display: 'flex', justifyContent: 'flex-end', gap:'10px'}}>
                    {/* {selectedAppointment && <Payment amount={selectedAppointment.price * 100} />} */}
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <div>
                            <Button 
                                key="pay" 
                                onClick={() => { setShowPayment(true)}} 
                                disabled={selectedAppointment?.isPaid} // Disable if isPaid is true
                            >
                                {selectedAppointment?.isPaid ? 'Paid!' : 'Process Payment'}
                            </Button>
                            <Button key="close" onClick={handleCloseModal}>
                                Close
                            </Button>
                        </div>
                        <div style={{padding: '10px'}}>
                        {showPayment && selectedAppointment && (
                            <Payment 
                                amount={selectedAppointment.price * 100} 
                                appointmentId={selectedAppointment._id} 
                            />
                        )}
                        </div>
                    </div>
                </Button.Group>

            

            ]}
        >
            {selectedAppointment && (
                
                <div>
                    <p><strong>Service:</strong> {selectedAppointment.service.name}</p>
                    <p><strong>Duration:</strong> {selectedAppointment.duration} minutes</p>
                    <p><strong>Date:</strong> {selectedAppointment.start.toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {formatTime(selectedAppointment.start)}</p>
                    <p><strong>Client:</strong> {selectedAppointment.user.firstName} {selectedAppointment.user.lastName}</p>
                    <p><strong>Price:</strong> ${selectedAppointment.price.toFixed(2)}</p>
                </div>
            )}
        </Modal>
        </div>
    );
}
