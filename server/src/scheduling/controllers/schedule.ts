import { Request, Response } from "express";
import { DateTime } from "luxon";

import { DI } from "../..";
import HttpError from "../../errors/HttpError";
import { Schedule, ScheduleOverride, TimeslotOverride } from "../entities";

require("express-async-errors");
export const getOwnerSchedule = async (req: Request, res: Response) => {
  const user = req.user!;
  const schedule = await DI.em.findOne(
    Schedule,
    { owner: user },
    { populate: ["scheduleOverrides", "scheduleOverrides.timeslots"] }
  );
  if (!schedule) {
    throw new HttpError(404, "Schedule not found");
  }

  const weeklySchedule = schedule.weeklySchedule;
  const scheduleOverrides: {
    day: string;
    timeslots: { startTime: string; endTime: string }[];
  }[] = [];
  for (let scheduleOverride of schedule.scheduleOverrides) {
    const timeslots: { startTime: string; endTime: string }[] = [];
    for (let timeslot of scheduleOverride.timeslots) {
      const startDateTime = DateTime.fromJSDate(timeslot.startTime, {
        zone: schedule.timezone,
      });
      const endDateTime = DateTime.fromJSDate(timeslot.endTime, {
        zone: schedule.timezone,
      });
      timeslots.push({
        startTime: startDateTime.toFormat("HH:mm"),
        endTime: endDateTime.toFormat("HH:mm"),
      });
    }
    scheduleOverrides.push({ day: scheduleOverride.day, timeslots });
  }
  res.json({ weeklySchedule, scheduleOverrides, timezone: schedule.timezone });
};

export const createSchedule = async (req: Request, res: Response) => {
  // create schedule
  const owner = req.user!;
  const existingSchedule = await DI.em.findOne(Schedule, { owner });
  if (existingSchedule) {
    throw new HttpError(409, "Schedule already exists");
  }

  const schedule = new Schedule();
  const timezone = req.body.timezone || "America/Los_Angeles";

  schedule.timezone = timezone;
  schedule.owner = owner;

  // process weekly schedule
  if (req.body.weeklySchedule) {
    for (let i = 0; i < req.body.weeklySchedule.length; i++) {
      const ws = req.body.weeklySchedule[i];
      if (ws && ws.timeslots) {
        schedule.weeklySchedule[i].timeslots = ws.timeslots;
      }
    }
  }

  // process overrides
  if (req.body.scheduleOverrides) {
    for (let override of req.body.scheduleOverrides) {
      const scheduleOverride = new ScheduleOverride();
      scheduleOverride.schedule = schedule;
      scheduleOverride.day = override.day;
      for (let timeslot of override.timeslots) {
        const timeslotOverride = new TimeslotOverride();
        timeslotOverride.scheduleOverride = scheduleOverride;
        const startDateTimeString = `${override.day} ${timeslot.startTime}`;
        const startDateTime = DateTime.fromFormat(
          startDateTimeString,
          "MM/dd/yy HH:mm",
          { zone: timezone }
        );
        const endDateTimeString = `${override.day} ${timeslot.endTime}`;
        const endDateTime = DateTime.fromFormat(
          endDateTimeString,
          "MM/dd/yy HH:mm",
          { zone: timezone }
        );

        timeslotOverride.startTime = startDateTime.toJSDate();
        timeslotOverride.endTime = endDateTime.toJSDate();

        DI.em.persist(timeslotOverride);
      }

      DI.em.persist(scheduleOverride);
    }
  }

  DI.em.persist(schedule);
  await DI.em.flush();

  res.status(201).json();
};

export const replaceSchedule = async (req: Request, res: Response) => {
  const owner = req.user!;
  const schedule = await DI.em.findOne(
    Schedule,
    { owner },
    { populate: ["scheduleOverrides"] }
  );
  if (!schedule) {
    throw new HttpError(404, "Schedule not found");
  }

  const timezone = req.body.timezone || "America/Los_Angeles";
  schedule.timezone = timezone;

  // replace weekly sschedule
  if (req.body.weeklySchedule) {
    for (let i = 0; i < req.body.weeklySchedule.length; i++) {
      const ws = req.body.weeklySchedule[i];
      if (ws && ws.timeslots) {
        schedule.weeklySchedule[i].timeslots = ws.timeslots;
      } else {
        schedule.weeklySchedule[i].timeslots = [];
      }
    }
  }

  // remove old overrides
  for (let scheduleOverride of schedule.scheduleOverrides) {
    DI.em.remove(scheduleOverride);
  }

  // new overrides
  for (let override of req.body.scheduleOverrides) {
    const scheduleOverride = new ScheduleOverride();
    scheduleOverride.schedule = schedule;
    scheduleOverride.day = override.day;
    for (let timeslot of override.timeslots) {
      const timeslotOverride = new TimeslotOverride();
      timeslotOverride.scheduleOverride = scheduleOverride;
      const startDateTimeString = `${override.day} ${timeslot.startTime}`;
      const startDateTime = DateTime.fromFormat(
        startDateTimeString,
        "MM/dd/yy HH:mm",
        { zone: timezone }
      );
      const endDateTimeString = `${override.day} ${timeslot.endTime}`;
      const endDateTime = DateTime.fromFormat(
        endDateTimeString,
        "MM/dd/yy HH:mm",
        { zone: timezone }
      );

      timeslotOverride.startTime = startDateTime.toJSDate();
      timeslotOverride.endTime = endDateTime.toJSDate();

      DI.em.persist(timeslotOverride);
    }

    DI.em.persist(scheduleOverride);
  }

  // save
  await DI.em.flush();

  res.json(schedule);
};

export const deleteSchedule = async (req: Request, res: Response) => {
  const owner = req.user!;
  const schedule = await DI.em.findOne(Schedule, { owner });
  if (!schedule) {
    throw new HttpError(404, "Schedule not found");
  }

  DI.em.removeAndFlush(schedule);
  res.json();
};

export const getAvailableSlots = async (_req: Request, _res: Response) => {};
