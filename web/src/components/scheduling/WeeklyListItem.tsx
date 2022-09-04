import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Input,
  SimpleGrid,
} from "@chakra-ui/react";
import React, { Fragment } from "react";

const daysOfTheWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

type Props = {
  index: number;
  weeklySchedule: { timeslots: { startTime: string; endTime: string }[] };
  replaceWeeklySchedule: (editedWeeklySchedule: any[]) => void;
};

const WeeklyListItem = ({
  index,
  weeklySchedule,
  replaceWeeklySchedule,
}: Props) => {
  // handle case for null
  const weekDaySchedule = weeklySchedule
    ? weeklySchedule[index]
    : { timeslots: [] };

  const createNewTimeslot = () => {
    const newTimeslot = { startTime: "14:00", endTime: "15:00" };
    weekDaySchedule.timeslots.push(newTimeslot);
    replaceWeeklySchedule(weekDaySchedule);
  };

  const removeTimeslot = (index) => {
    weekDaySchedule.timeslots.splice(index, 1);
    replaceWeeklySchedule(weekDaySchedule);
  };

  const changeTimeslotStartTime = (index, newStartTime) => {
    weekDaySchedule.timeslots[index].startTime = newStartTime;
    replaceWeeklySchedule(weekDaySchedule);
  };

  const changeTimeslotEndTime = (index, newEndTime) => {
    weekDaySchedule.timeslots[index].endTime = newEndTime;
    replaceWeeklySchedule(weekDaySchedule);
  };

  return (
    <Box>
      <Grid templateColumns="repeat(4, 1fr)" gap={5}>
        <Box fontWeight={"bold"}>{daysOfTheWeek[index]}</Box>
        {weekDaySchedule.timeslots.map((timeslot, index) => {
          return (
            <Fragment key={index}>
              {index != 0 && <Box />}
              <GridItem colSpan={3}>
                <Flex alignItems="center">
                  <Input
                    type="time"
                    marginRight={5}
                    value={timeslot.startTime}
                    onChange={(e) => {
                      changeTimeslotStartTime(index, e.target.value);
                    }}
                  />
                  {"-"}
                  <Input
                    type="time"
                    marginLeft={5}
                    value={timeslot.endTime}
                    onChange={(e) => {
                      changeTimeslotEndTime(index, e.target.value);
                    }}
                  />
                  <IconButton
                    aria-label="delete timeslot"
                    icon={<DeleteIcon />}
                    marginLeft={5}
                    onClick={() => {
                      removeTimeslot(index);
                    }}
                  />
                </Flex>
              </GridItem>
            </Fragment>
          );
        })}
        {weekDaySchedule.timeslots.length > 0 ? (
          <Fragment>
            <Box />
            <Button leftIcon={<AddIcon />} onClick={createNewTimeslot}>
              Add Timeslot
            </Button>
          </Fragment>
        ) : (
          <Box>Unavailable</Box>
        )}
      </Grid>
    </Box>
  );
};

export default WeeklyListItem;
