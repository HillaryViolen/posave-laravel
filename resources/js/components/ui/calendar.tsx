import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, ...props }: CalendarProps) {
    return (
        <DayPicker
            className={className}
            modifiersStyles={{
                selected: {
                    backgroundColor: '#1e293b',
                    color: '#fff',
                    borderRadius: '6px',
                },
                today: {
                    fontWeight: '700',
                    color: '#3b82f6',
                },
            }}
            styles={{
                caption: { fontWeight: '600', fontSize: '0.875rem' },
                head_cell: { fontWeight: '500', fontSize: '0.8rem', color: '#94a3b8' },
                day: { borderRadius: '6px', fontSize: '0.875rem' },
                nav_button: {
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    width: '1.75rem',
                    height: '1.75rem',
                },
            }}
            {...props}
        />
    );
}
Calendar.displayName = 'Calendar';

export { Calendar };
