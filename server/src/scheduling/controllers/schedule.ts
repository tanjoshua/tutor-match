import { Request, Response } from "express";
import { DI } from "../..";
import HttpError from "../../errors/HttpError";
import { Schedule } from "../entities";

require("express-async-errors");
export const getOwnerSchedule = async (req: Request, res: Response) => {
  const user = req.user!;
  const schedule = await DI.em.findOne(Schedule, { user });
  if (!schedule) {
    throw new HttpError(404, "Schedule not found");
  }

  // get 1 week window
  // start of the week should be attached to the request (to support internationalization)
  const startingDate = new Date(String(req.query.start));
  const endingDate = new Date(
    startingDate.getTime() + 7 * (1000 * 60 * 60 * 24)
  );

  const slots: Array<Array<{ startTime: Date }>> = [[], [], [], [], [], [], []];

  for (const timeslot of schedule.timeslots) {
    if (timeslot.startTime < startingDate) {
      continue;
    }
    if (timeslot.startTime > endingDate) {
      break;
    }

    const diff = timeslot.startTime.getTime() - startingDate.getTime();
    const index = Math.floor(diff / (1000 * 60 * 60 * 24));

    slots[index].push(timeslot);
  }

  for (const recurringTimeslot of schedule.recurringTimeslots) {
    const startTime = new Date(
      startingDate.getTime() +
        recurringTimeslot.day * (1000 * 60 * 60 * 24) +
        recurringTimeslot.timeblock * (1000 * 60 * 30)
    );
    const timeslot = { startTime };
    slots[recurringTimeslot.day].push(timeslot);
  }

  // sort by ascending start time
  for (const day of slots) {
    day.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }

  res.json({ schedule: slots });
};

export const createSchedule = async (_req: Request, _res: Response) => {};

export const replaceSchedule = async (_req: Request, _res: Response) => {};

export const deleteSchedule = async (_req: Request, _res: Response) => {};

export const getAvailableSlots = async (_req: Request, _res: Response) => {};
