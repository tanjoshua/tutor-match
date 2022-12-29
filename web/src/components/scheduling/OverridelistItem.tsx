import { Box, Flex } from "@chakra-ui/react";
import React from "react";

type Props = {
  scheduleOverride: {
    day: string;
    timeslots: { startTime: string; endTime: string }[];
  };
};

const OverrideListItem = ({ scheduleOverride }: Props) => {
  return (
    <Box>
      <Flex>
        <Box>{scheduleOverride.day}</Box>
        <Box marginLeft={10}>
          {scheduleOverride.timeslots.map((timeslot, index) => (
            <Box key={index}>
              {timeslot.startTime} - {timeslot.endTime}
            </Box>
          ))}
        </Box>
      </Flex>
    </Box>
  );
};

export default OverrideListItem;
