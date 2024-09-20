import React, { useState } from 'react';
import { Calendar, Views, dayjsLocalizer } from 'react-big-calendar';
import { useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { QUERY_APPOINTMENTS } from '../utils/queries';

// Initialize localizer
const localizer = dayjsLocalizer(dayjs);

export default function CalendarSetup() {
  const [view, setView] = useState(Views.WEEK);

  // Fetch appointments from GraphQL
  const { loading, error, data } = useQuery(QUERY_APPOINTMENTS);

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
    const totalDuration = appointment.duration + appointment.service.cleanup;
  
    // Calculate the end time by adding total duration to start time
    const end = new Date(start.getTime() + totalDuration * 60000); // Convert to milliseconds
  
    return {
      title: `${appointment.duration} ${appointment.service.name}\n${appointment.user.firstName} ${appointment.user.lastName}`,
      start: start,
      end: end,
      allDay: false,
    };
  });

  return (
    <div>
      <Calendar
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
      />
    </div>
  );
}
