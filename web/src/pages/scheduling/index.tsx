import { ReactElement, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import LayoutWithNav from "../../components/base/LayoutWithNav";
import redirectIfNotAuth from "../../utils/redirectIfNotAuth";
import { NextPageWithLayout } from "../_app";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import useSWR from "swr";
import { fetcher } from "../../api/fetcher";
import WeeklyListItem from "../../components/scheduling/WeeklyListItem";
import OverrideListItem from "../../components/scheduling/OverridelistItem";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { replaceSchedule } from "../../api/scheduling";

interface Props {}
type ScheduleData = {
  timezone: string;
  weeklySchedule: { timeslots: { startTime: string; endTime: string }[] }[];
  scheduleOverrides: {
    day: string;
    timeslots: { startTime: string; endTime: string }[];
  }[];
};

const timezones = ["Asia/Singapore", "America/New_York", "America/Los_Angeles"];
const timezoneOptions = timezones.map((value: string) => ({
  label: value,
  value,
}));

const Schedule: NextPageWithLayout<Props> = ({}) => {
  redirectIfNotAuth();
  const { data, error, mutate } = useSWR<ScheduleData>(
    "/scheduling/schedule/owner",
    fetcher,
    {
      shouldRetryOnError: false, // since 404 is a valid response, we should not retry on error
    }
  );
  const [timezone, setTimezone] = useState(null);
  const [weeklySchedule, setWeeklySchedule] = useState(null);
  const [scheduleOverrides, setScheduleOverrides] = useState(null);

  useEffect(() => {
    if (data) {
      setTimezone(data.timezone);
      setWeeklySchedule(data.weeklySchedule);
      setScheduleOverrides(data.scheduleOverrides);
    }
  }, [data]);

  const hasChanged = useMemo(() => {
    return (
      timezone != data?.timezone ||
      weeklySchedule != data?.weeklySchedule ||
      scheduleOverrides != data?.scheduleOverrides
    );
  }, [data, timezone, weeklySchedule, scheduleOverrides]);

  const isLoading = !data && !error;
  const notFound = error && error.response.status == 404;
  const found = !!data;

  const toast = useToast();

  const saveChanges = async () => {
    const newData = { timezone, weeklySchedule, scheduleOverrides };
    try {
      await replaceSchedule(newData);
      mutate();
      toast({ title: "Updated schedule", status: "success" });
    } catch (err) {
      mutate();
      console.log(err);
    }
  };

  return (
    <>
      <Stack>
        {!isLoading && notFound && (
          <Stack
            borderRadius="lg"
            borderWidth="0.5"
            alignSelf={"center"}
            alignContent="center"
            shadow="lg"
            p={10}
          >
            <Heading size="md">No Schedule found</Heading>
            <Button as="a" href="/scheduling/edit">
              Create one now
            </Button>
          </Stack>
        )}
        {!isLoading && found && (
          <Stack>
            <Flex justify="space-between" alignItems="flex-start">
              <Stack flex={0.75}>
                <Heading size="md">Timezone</Heading>
                <Select
                  instanceId="timezone"
                  options={timezoneOptions}
                  onChange={(value) => setTimezone(value.value)}
                  value={{ label: timezone, value: timezone }}
                />
              </Stack>
              <Button
                leftIcon={<AddIcon />}
                isDisabled={!hasChanged}
                onClick={saveChanges}
              >
                Save Changes
              </Button>
            </Flex>
            <Heading size="md">Weekly schedule</Heading>
            <Stack divider={<Divider />}>
              {data.weeklySchedule.map((daySchedule, index) => (
                <WeeklyListItem
                  index={index}
                  weeklySchedule={weeklySchedule}
                  key={index}
                  replaceWeeklySchedule={(editedWeeklySchedule) => {
                    const newWeeklySchedule = [...weeklySchedule];
                    newWeeklySchedule[index] = editedWeeklySchedule;
                    setWeeklySchedule(newWeeklySchedule);
                  }}
                />
              ))}
            </Stack>
            <Heading size="md">Overrides</Heading>
            {data.scheduleOverrides.map((override) => (
              <OverrideListItem
                scheduleOverride={override}
                key={override.day}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </>
  );
};

Schedule.getLayout = (page: ReactElement) => {
  return <LayoutWithNav>{page}</LayoutWithNav>;
};

export default Schedule;
