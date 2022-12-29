import { ReactElement } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
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

interface Props {}

const timezones = ["Asia/Singapore", "America/New_York"];
const timezoneOptions = timezones.map((value: string) => ({
  label: value,
  value,
}));
const daysOfTheWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const EditSchedule: NextPageWithLayout<Props> = ({}) => {
  redirectIfNotAuth();
  const router = useRouter();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (values) => {
    try {
      console.log(values);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Heading>Edit your schedule</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <FormControl isInvalid={!!errors.timezone}>
            <FormLabel htmlFor="timezone">Timezone</FormLabel>
            <Controller
              name="timezone"
              control={control}
              render={({ field }) => (
                <Select
                  instanceId="timezone"
                  options={timezoneOptions}
                  {...field}
                  onChange={(val) => field.onChange(val.value)}
                />
              )}
            />
          </FormControl>

          <Button type="submit" isLoading={isSubmitting}>
            Update
          </Button>
        </Stack>
      </form>
    </>
  );
};

EditSchedule.getLayout = (page: ReactElement) => {
  return <LayoutWithNav>{page}</LayoutWithNav>;
};

export default EditSchedule;
