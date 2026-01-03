import React, { useEffect, useRef } from 'react';
import { Event } from '../../types';
import styles from './Events.module.css';

interface EventsProps {
  events: Event[];
}

const Events: React.FC<EventsProps> = ({ events }) => {
  const eventsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    eventsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  const getTypeClass = (type: Event['type']) => {
    switch (type) {
      case 'success':
        return styles.success;
      case 'error':
        return styles.error;
      case 'user':
        return styles.user;
      default:
        return styles.system;
    }
  };

  return (
    <div className={styles.events}>
      <h2 className={styles.title}>Events</h2>
      <div className={styles.logContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.timeHeader}>Time</th>
              <th className={styles.typeHeader}>Type</th>
              <th className={styles.messageHeader}>Message</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className={styles.row}>
                <td className={styles.timeCell}>{event.timestamp}</td>
                <td className={styles.typeCell}>
                  <span className={`${styles.typeBadge} ${getTypeClass(event.type)}`}>
                    {event.type}
                  </span>
                </td>
                <td className={styles.messageCell}>{event.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div ref={eventsEndRef} />
      </div>
    </div>
  );
};

export default Events;

