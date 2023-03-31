import Head from "next/head";
import { NextPageWithLayout } from "./_app";
import { ReactElement, useState } from "react";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import Layout from "../components/layouts/Layout";
import { useFormik } from "formik";
import { googleLogin, login } from "@/services/auth";
import axios from "axios";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import { redirectIfLoggedIn } from "@/utils/redirect";
import ForgetPasswordModal from "@/components/auth/ForgetPasswordModal";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { toast } from "react-hot-toast";

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
        toast.success("Logged in");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            toast.error("Invalid credentials");
          } else {
            toast.error("Couldn't log in");
          }
        }
      }
    },
  });
  const [forgetPasswordModalIsOpen, setForgetPasswordModalIsOpen] =
    useState(false);

  const onGoogleLoginSuccess = async (response: CredentialResponse) => {
    const credential = response.credential;
    if (credential) {
      try {
        await googleLogin({ credential });
        queryClient.refetchQueries("me");
        toast.success("Logged in");
      } catch {
        toast.error("Couldn't log in");
      }
    } else {
      toast.error("Could not get credentials");
    }
  };

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
          <div className="w-full max-w-md space-y-6">
            <div>
              <div className="mx-auto w-min text-4xl text-gray-800 font-sans font-medium tracking-wide rounded-md px-2 py-1">
                tutoring.<span className="text-red-500">sg</span>
              </div>
              <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                Sign in to your account <br />
                (tutor portal)
              </h2>
            </div>
            <div className="flex justify-center">
              <GoogleLogin
                size={"large"}
                useOneTap
                onSuccess={onGoogleLoginSuccess}
                onError={() => toast.error("Couldn't log in")}
              />
            </div>
            <div>
              <div className="flex items-center">
                <div className="flex-grow border-t border-1 flex-1"></div>
                <div className="-mt-1 mx-2 text-gray-400 text-sm">or</div>
                <div className="flex-grow border-t border-1 flex-1"></div>
              </div>
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
                No account?{" "}
                <a
                  href="/register"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Create one
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
