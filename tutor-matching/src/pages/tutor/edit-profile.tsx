import { NextPageWithLayout } from "../_app";
import { ReactElement, useState } from "react";
import Layout from "../../components/Layout";
import { useQuery } from "react-query";
import {
  createTutorProfile,
  getTutorLevels,
  getUserTutorProfile,
  replaceTutorProfile,
} from "@/services/tutor";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import { Listbox } from "@headlessui/react";
import ReactSelect from "react-select";
import Creatable from "react-select/creatable";
import Head from "next/head";

const tutorTypes = [
  "Part-Time Tutor",
  "Full-Time Tutor",
  "Ex/Current MOE Tutor",
];
const initialValues = {
  isPublic: false,
  title: "",
  tutorName: "",
  levels: [],
  subjects: [],
  type: "",
  qualifications: "",
  description: "",
  pricing: { rate: "", details: "" },
  contactInfo: { phoneNumber: "", email: "" },
};

const EditProfile: NextPageWithLayout = () => {
  const router = useRouter();
  const { isLoading, error, data, refetch } = useQuery(
    "userTutorProfile",
    getUserTutorProfile
  );
  const {
    isLoading: isLoadingLevels,
    error: levelsError,
    data: levelsData,
  } = useQuery("tutorLevels", getTutorLevels);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: !isLoading && data.profile ? data.profile : initialValues,
    onSubmit: async (values) => {
      try {
        await replaceTutorProfile({ ...values, id: data.profile.id });
        router.push("/tutor/profile");
      } catch (e) {
        alert("Could not edit profile");
      }
    },
  });

  const levelOptions =
    isLoadingLevels || levelsError
      ? []
      : levelsData.levels.map((level: string) => ({
          label: level,
          value: level,
        }));

  if (isLoading) {
    return <></>;
  }

  return (
    <div>
      <Head>
        <title>Create Profile</title>
      </Head>
      <form className="px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-900">Title</label>
          <input
            type="text"
            id="title"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none block w-full p-2.5"
            placeholder="Eg. Mathematics Tutor with 5 years of experience."
            onChange={formik.handleChange}
            value={formik.values.title}
            required
          />
          <p className="mt-2 text-sm text-gray-500">
            You can write whatever you want in the title. We recommend a brief
            description of your tutoring services.
          </p>
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-900">
            Tutor Name
          </label>
          <input
            type="text"
            id="tutorName"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:indigo-blue-500 focus:border-indigo-500 focus:outline-none block w-full p-2.5"
            placeholder="Eg. Mr Tan"
            onChange={formik.handleChange}
            value={formik.values.tutorName}
            required
          />
          <p className="mt-2 text-sm text-gray-500">
            Your tutor name does not have to be your full name. It can be
            something as simple as Mr/Ms surname.
          </p>
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-900">
            Levels taught
          </label>
          <div>
            <ReactSelect
              isMulti
              isClearable
              options={levelOptions}
              name="levels"
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: "indigo",
                },
              })}
              styles={{
                control: (styles) => ({
                  ...styles,
                  boxShadow: "none !important",
                  "*": {
                    boxShadow: "none !important",
                  },
                }),
              }}
              onChange={(value) => {
                formik.setFieldValue(
                  "levels",
                  value.map((x) => x.value)
                );
              }}
              value={formik.values.levels.map((x: string) => ({
                value: x,
                label: x,
              }))}
            />
          </div>

          <p className="mt-2 text-sm text-gray-500">
            You can select multiple levels.
          </p>
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-900">
            Subjects taught
          </label>
          <Creatable
            isMulti
            name="subjects"
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary: "indigo",
              },
            })}
            styles={{
              control: (styles) => ({
                ...styles,
                boxShadow: "none !important",
                "*": {
                  boxShadow: "none !important",
                },
              }),
            }}
            onChange={(value) => {
              formik.setFieldValue(
                "subjects",
                value.map((x) => x.value)
              );
            }}
            value={formik.values.subjects.map((x: string) => ({
              value: x,
              label: x,
            }))}
          />

          <p className="mt-2 text-sm text-gray-500">
            You can also create new subjects not listed
          </p>
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-900">
            Tutor type
          </label>
          <ReactSelect
            name="type"
            isClearable
            options={tutorTypes.map((type) => ({ label: type, value: type }))}
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary: "indigo",
              },
            })}
            styles={{
              control: (styles) => ({
                ...styles,
                boxShadow: "none !important",
                "*": {
                  boxShadow: "none !important",
                },
              }),
            }}
            onChange={(value) => {
              formik.setFieldValue("type", value ? value.value : "");
            }}
            value={{ label: formik.values.type, value: formik.values.type }}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-900">
            Pricing
          </label>
          <div className="flex flex-row items-center mb-2">
            <div className="text-sm text-gray-900">Rate</div>
            <div className="relative rounded-md border-gray-300 pl-7 mr-2">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-900 sm:text-sm">$</span>
              </div>
              <input
                type="text"
                id="pricing.rate"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none block p-2.5"
                placeholder="0.00"
                onChange={formik.handleChange}
                value={formik.values.pricing.rate}
              />
            </div>
            <div>/ hr</div>
          </div>
          <div>
            <div className="mb-2 text-sm text-gray-900">Pricing details</div>
            <textarea
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-indigo-600 focus:outline-none"
              id="pricing.details"
              rows={3}
              placeholder=""
              onChange={formik.handleChange}
              value={formik.values.pricing.details}
            ></textarea>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            If you have specific pricing policies, please indicate them here.
          </p>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-900">
            Tutoring experience and academic qualifications
          </label>
          <textarea
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-indigo-600 focus:outline-none"
            id="qualifications"
            rows={3}
            placeholder=""
            onChange={formik.handleChange}
            value={formik.values.qualifications}
          ></textarea>

          <p className="mt-2 text-sm text-gray-500">
            Describe your tutoring experience and academic or other
            qualifications.
          </p>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-900">
            Tutor description
          </label>
          <textarea
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-indigo-600 focus:outline-none"
            id="description"
            rows={3}
            placeholder=""
            onChange={formik.handleChange}
            value={formik.values.description}
          ></textarea>

          <p className="mt-2 text-sm text-gray-500">
            For any other information that you want to convey to potential
            customers.
          </p>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-900">
            Contact Information (Fill in at least one)
          </label>
          <div className="flex flex-row items-center mb-2">
            <div className="text-sm text-gray-900 mr-2">Email:</div>
            <input
              type="email"
              id="contactInfo.email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none block p-2.5 w-full"
              onChange={formik.handleChange}
              value={formik.values.contactInfo.email}
            />
          </div>
          <div className="flex flex-row items-center mb-2">
            <div className="text-sm text-gray-900">Phone Number:</div>
            <div className="relative rounded-md border-gray-300 pl-10 mr-2">
              <div className="absolute inset-y-0 left-0 flex items-center pl-2">
                <span className="text-gray-900 sm:text-sm">+65</span>
              </div>
              <input
                type="text"
                id="contactInfo.phoneNumber"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none block p-2.5"
                onChange={formik.handleChange}
                value={formik.values.contactInfo.phoneNumber}
              />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Let potential customers contact you
          </p>
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-900">
            Privacy Settings
          </label>
          <div className="flex items-center mb-4">
            <input
              id="isPublic"
              type="checkbox"
              className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded-lg focus:ring-indigo-500 accent-indigo-500"
              onChange={formik.handleChange}
              checked={formik.values.isPublic}
            />
            <label className="ml-2 text-sm text-gray-900 ">
              Public profile
            </label>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            By making your tutor profile public, your tutor profile will be
            discoverable on our tutor marketplace.
          </p>
        </div>
        {formik.isSubmitting ? (
          <div className="text-center">
            <button
              disabled
              type="button"
              className="text-white bg-indigo-700 hover:bg-blue-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
            >
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-4 h-4 mr-3 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
              Loading...
            </button>
          </div>
        ) : (
          <div className="text-center">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Make Edits
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

EditProfile.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default EditProfile;
