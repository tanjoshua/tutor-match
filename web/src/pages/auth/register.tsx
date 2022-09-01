import { ReactElement } from "react";
import { useForm } from "react-hook-form";
import {
  Text,
  Box,
  Stack,
  Heading,
  useColorModeValue,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Link,
  Button,
  Flex,
  FormErrorMessage,
} from "@chakra-ui/react";
import LayoutWithNav from "../../components/base/LayoutWithNav";
import { NextPageWithLayout } from "../_app";
import { useRouter } from "next/router";
import { loginUser, registerUser } from "../../api/auth";
import redirectIfAuth from "../../utils/redirectIfAuth";

interface Props {}

const Register: NextPageWithLayout<Props> = ({}) => {
  redirectIfAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (values) => {
    try {
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      if (router.query.next && typeof router.query.next === "string") {
        router.push("/");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Stack align="center">
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Create an account with us</Heading>
            <Text fontSize={"lg"} color={"gray.600"}>
              to manage your schedule and listings
            </Text>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={4}>
                <FormControl isInvalid={!!errors.name}>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <Input
                    id="name"
                    type="name"
                    {...register("name", { required: "Required field" })}
                  />
                  <FormErrorMessage>
                    {errors.name && String(errors.name.message)}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel htmlFor="email">Email address</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    {...register("email", { required: "Required field" })}
                  />
                  <FormErrorMessage>
                    {errors.email && String(errors.email.message)}
                  </FormErrorMessage>
                </FormControl>
                <FormControl id="password" isInvalid={!!errors.password}>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Input
                    id="password"
                    type="password"
                    {...register("password", { required: "Required field" })}
                  />
                  <FormErrorMessage>
                    {errors.password && String(errors.password.message)}
                  </FormErrorMessage>
                </FormControl>
                <Stack spacing={10}>
                  <Stack
                    direction={{ base: "column", sm: "row" }}
                    align={"start"}
                    justify={"space-between"}
                  >
                    <Link
                      href={`/auth/login${
                        router.query.next ? `?next=${router.query.next}` : ""
                      }`}
                    >
                      <Button variant={"link"}>Already have an account?</Button>
                    </Link>
                  </Stack>
                  <Button
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{
                      bg: "blue.500",
                    }}
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    Create account
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Stack>
    </>
  );
};

Register.getLayout = (page: ReactElement) => {
  return <LayoutWithNav>{page}</LayoutWithNav>;
};

export default Register;
