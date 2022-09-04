import axiosInstance from "./instances/axiosInstance";

export const createSchedule = ({
  timezone,
  weeklySchedule,
  scheduleOverrides,
}: {
  timezone: string;
  weeklySchedule: { timeslots: { startTime: string; endTime: string }[] }[];
  scheduleOverrides: {
    day: string;
    timeslots: { startTime: string; endTime: string }[];
  }[];
}) => {
  return axiosInstance.post("/scheduling/schedule", {
    timezone,
    weeklySchedule,
    scheduleOverrides,
  });
};

export const replaceSchedule = ({
  timezone,
  weeklySchedule,
  scheduleOverrides,
}: {
  timezone: string;
  weeklySchedule: { timeslots: { startTime: string; endTime: string }[] }[];
  scheduleOverrides: {
    day: string;
    timeslots: { startTime: string; endTime: string }[];
  }[];
}) => {
  return axiosInstance.put("/scheduling/schedule", {
    timezone,
    weeklySchedule,
    scheduleOverrides,
  });
};
