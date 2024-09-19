import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

// Create timeslots in 45 minute increments
export const generateTimeSlots = (date) => {
    const slots = [];

    const startTime = dayjs(date).tz('America/Denver').set('hour', 10).set('minute', 0); // 10:00 start time
    const endTime = dayjs(date).tz('America/Denver').set('hour', 18).set('minute', 15); // 6:15 end time

    let time = startTime;
    while (time.isBefore(endTime)) {
        slots.push({
            time: time.toDate(),
            booked: false,
        });
        time = time.add(45, 'minute'); // Add 45 minutes
    }
    return slots;
};

