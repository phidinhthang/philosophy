import { v4 } from 'uuid';
import { getCurrentWeek } from './time/getCurrentWeek';

export const scorePlaceholder = () => {
  return getCurrentWeek().map((day) => ({
    day,
    score: 0,
    id: v4(),
  }));
};
