import Head from "next/head";
import { NextPageWithLayout } from "./_app";
import { ReactElement } from "react";
import Layout from "../components/Layout";
import { useFormik } from "formik";
import { googleRegister, register } from "@/services/auth";
import { useRouter } from "next/router";
import axios, { AxiosError } from "axios";
import { redirectIfLoggedIn } from "@/utils/redirect";
import toast from "react-hot-toast";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useQueryClient } from "react-query";

const Register: NextPageWithLayout = () => {
  redirectIfLoggedIn();
  const router = useRouter();
  const queryClient = useQueryClient();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        await register(values);
        toast.success("Account created");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 403) {
            toast.error("Account with email already exists");
          } else {
            toast.error("Error creating account");
          }
        }
      }
    },
  });
  const onGoogleLoginSuccess = async (response: CredentialResponse) => {
    const credential = response.credential;
    if (credential) {
      try {
        await googleRegister({ credential });
        queryClient.refetchQueries("me");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 403) {
            toast.error("Account with email already exists");
          } else {
            toast.error("Error creating account");
          }
        }
      }
    } else {
      toast.error("Could not get credentials");
    }
  };
  return (
    <>
      <Head>
        <title>Register</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Create a tutor account
            </h2>
          </div>
          <div className="flex justify-center">
            <GoogleLogin
              size={"large"}
              useOneTap
              onSuccess={onGoogleLoginSuccess}
              onError={() => toast.error("Couldn't log in")}
              text="signup_with"
            />
          </div>
          <div>
            <div className="flex items-center">
              <div className="flex-grow border-t border-1 flex-1"></div>
              <div className="-mt-1 mx-2 text-gray-400 text-sm">or</div>
              <div className="flex-grow border-t border-1 flex-1"></div>
            </div>
          </div>
          <form
            className="mt-8 space-y-6"
            autoComplete="off"
            onSubmit={formik.handleSubmit}
          >
            <div>
              <label className="block text-sm font-medium mb-2 ">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none block w-full p-2.5"
                placeholder="Name"
                onChange={formik.handleChange}
                value={formik.values.name}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 ">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none block w-full p-2.5"
                placeholder="Email address"
                onChange={formik.handleChange}
                value={formik.values.email}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 ">
                Password
              </label>

              <input
                type="password"
                id="password"
                name="password"
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none block w-full p-2.5"
                placeholder="Password"
                onChange={formik.handleChange}
                value={formik.values.password}
                required
              />
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Create
              </button>
            </div>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

Register.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default Register;
