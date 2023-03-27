import Head from "next/head";
import { NextPageWithLayout } from "./_app";
import { ReactElement, useState } from "react";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import Layout from "../components/Layout";
import { useFormik } from "formik";
import { login } from "@/services/auth";
import axios from "axios";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import { redirectIfLoggedIn } from "@/utils/redirect";
import ForgetPasswordModal from "@/components/auth/ForgetPasswordModal";

const Login: NextPageWithLayout = () => {
  redirectIfLoggedIn();
  const router = useRouter();
  const queryClient = useQueryClient();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        await login(values);
        queryClient.refetchQueries("me");
        router.push("/tutor/your-profile");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            console.log("Invalid credentials");
          } else {
            console.log("Error");
          }
        }
      }
    },
  });
  const [forgetPasswordModalIsOpen, setForgetPasswordModalIsOpen] =
    useState(false);
  return (
    <>
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ForgetPasswordModal
        open={forgetPasswordModalIsOpen}
        setOpen={setForgetPasswordModalIsOpen}
      />
      <>
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <div>
              <img
                className="mx-auto h-12 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt="Your Company"
              />
              <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                Sign in to your account
              </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
              <input type="hidden" name="remember" defaultValue="true" />
              <div className="-space-y-px rounded-md shadow-sm">
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Email address"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                  />
                </div>
                <div className="relative">
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end">
                <div className="text-sm">
                  <a
                    className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
                    onClick={() => setForgetPasswordModalIsOpen(true)}
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <LockClosedIcon
                      className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                      aria-hidden="true"
                    />
                  </span>
                  Sign in
                </button>
              </div>

              <div className="text-center text-sm">
                Or{" "}
                <a
                  href="register"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  create an account
                </a>
              </div>
            </form>
          </div>
        </div>
      </>
    </>
  );
};

Login.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default Login;
