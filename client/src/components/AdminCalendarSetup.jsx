import { useState, useEffect } from 'react';
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
    // State for managing responsiveness for calendar view
    const [isSmallScreen, setIsSmallScreen] = useState(window.matchMedia('(max-width: 880px)').matches);

    const [view, setView] = useState(Views.WEEK);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isPaid, setIsPaid] = useState(false); // Track payment status

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 880px)');

        const handleScreenChange = (event) => {
            setIsSmallScreen(event.matches); // Update state based on media query match
        };

        // Initial check
        setIsSmallScreen(mediaQuery.matches);

        // Add listener for screen changes
        mediaQuery.addEventListener('change', handleScreenChange);

        // Cleanup the event listener on component unmount
        return () => mediaQuery.removeEventListener('change', handleScreenChange);
    }, []);

    useEffect(() => {
        // Update view based on screen size
        isSmallScreen ? setView(Views.DAY) : setView(Views.WEEK);
    }, [isSmallScreen]);

    // Fetch appointments from GraphQL - Always fetch from network not cached value
    const { loading, error, data, refetch} = useQuery(QUERY_APPOINTMENTS, {
        fetchPolicy: "network-only"
    }); 

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error fetching appointments.</p>;

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
        const totalDuration = appointment.duration + appointment.cleanup;
    
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
        setIsPaid(event.appointment.isPaid); // Set payment status based on the selected appointment
        setModalOpen(true); // Open the modal
    };

    const handleCloseModal = () => {
        setModalOpen(false); // Close the modal
        setSelectedAppointment(null); // Clear selected appointment
        setIsPaid(false); // Reset the payment status when modal is closed
    };

    const handlePaymentSuccess = () => {
        setIsPaid(true); // Mark the appointment as paid on success
    };

    return (
        <div>
        <Calendar
            min={new Date().setHours(10, 0)} // Set start time to 10:00 AM
            max={new Date().setHours(18, 15)} // Set end time to 6:15 PM
            localizer={localizer}
            events={events} // Pass the transformed events
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500, margin: '50px' }}
            view={view} // Bind view state directly to the Calendar's view prop
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
                <Button key="close" onClick={handleCloseModal}>
                    Close
                </Button>
            ]}
        >
            {selectedAppointment && (
                
                <div>
                    <p><strong>Service:</strong> {selectedAppointment.service.name}</p>
                    <p><strong>Duration:</strong> {selectedAppointment.duration} minutes</p>
                    <p><strong>Cleanup:</strong> {selectedAppointment.cleanup} minutes</p>
                    <p><strong>Date:</strong> {selectedAppointment.start.toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {formatTime(selectedAppointment.start)}</p>
                    <p><strong>Client:</strong> {selectedAppointment.user.firstName} {selectedAppointment.user.lastName}</p>
                    <p><strong>Price:</strong> ${selectedAppointment.price.toFixed(2)}</p>
                    {/* Show "Service has been paid" if paid, otherwise show Payment component */}
                    {isPaid ? (
                        <p>Service has been paid!</p>
                    ) : (
                        <Payment
                            amount={selectedAppointment.price * 100} // Send price in cents
                            appointmentId={selectedAppointment._id}
                            onPaymentSuccess={handlePaymentSuccess} // Handle payment success
                        />
                    )}
                </div>
            )}
        </Modal>
        </div>
    );
}