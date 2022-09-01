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
  useToast,
} from "@chakra-ui/react";
import LayoutWithNav from "../../components/base/LayoutWithNav";
import { NextPageWithLayout } from "../_app";
import { useRouter } from "next/router";
import { loginUser } from "../../api/auth";
import redirectIfAuth from "../../utils/redirectIfAuth";
import urlNextify from "../../utils/urlNextify";

interface Props {}

const Login: NextPageWithLayout<Props> = ({}) => {
  redirectIfAuth();
  const router = useRouter();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (values) => {
    try {
      await loginUser({ email: values.email, password: values.password });
      if (typeof router.query.next === "string") {
        router.push(router.query.next || "/");
      } else {
        router.push("/");
      }
      toast({ title: "Logged in", status: "success" });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Stack align="center">
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Sign in to your account</Heading>
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
                      href={`/auth/register${urlNextify(router.query.next)}`}
                    >
                      <Button variant={"link"}>Create account</Button>
                    </Link>
                    <Link color={"blue.400"} href="/forgot-password">
                      Forgot password?
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
                    Sign in
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

Login.getLayout = (page: ReactElement) => {
  return <LayoutWithNav>{page}</LayoutWithNav>;
};

export default Login;
