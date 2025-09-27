import { format, startOfWeek, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

export const buildWeekDays = (date: Date) => {
  const start = startOfWeek(date, { weekStartsOn: 0 });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

export const buildMonthMatrix = (date: Date) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const days = eachDayOfInterval({ start, end });
  
  const matrix: string[][] = [];
  let week: string[] = [];
  
  days.forEach((day) => {
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
    week.push(day.toISOString());
  });
  
  if (week.length > 0) {
    matrix.push(week);
  }
  
  return matrix;
};

export const isInMonth = (dateStr: string, month: Date) => {
  const date = new Date(dateStr);
  return date.getMonth() === month.getMonth() && date.getFullYear() === month.getFullYear();
};

export const isSameDaySafe = (date1: string | Date, date2: string | Date) => {
  try {
    return isSameDay(new Date(date1), new Date(date2));
  } catch {
    return false;
  }
};