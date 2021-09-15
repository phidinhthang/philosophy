import { getTodayTime } from './getTodayTime';

export const getCurrentWeek = () => {
  return Array.from({ length: 7 }, (_, i) => i).map((i) =>
    getTodayTime({ offset: i }),
  );
};
