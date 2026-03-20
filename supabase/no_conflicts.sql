CREATE UNIQUE INDEX unique_appointment_slot 
ON appointments (pro_id, appointment_date, appointment_time) 
WHERE status != 'cancelled';
