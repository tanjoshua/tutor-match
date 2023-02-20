import { NextPageWithLayout } from "../_app";
import { ReactElement, useState } from "react";
import Layout from "../../components/Layout";
import { useQuery } from "react-query";
import {
  createTutorProfile,
  getTutorLevels,
  getUserTutorProfile,
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

const CreateProfile: NextPageWithLayout = () => {
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
    initialValues: {
      title: "",
      tutorName: "",
      levels: [],
      subjects: [],
      type: "",
      qualifications: "",
      description: "",
      pricing: { rate: "", details: "" },
      contactInfo: { phoneNumber: "", email: "" },
    },
    onSubmit: async (values) => {
      try {
        await createTutorProfile(values);
        router.push("/tutor/profile");
      } catch (e) {
        alert("could not create profile");
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

  if (data.profile) {
    // profile already exists, redirecting
    router.replace("/tutor/profile");
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
              value={formik.values.levels.map((x) => ({ value: x, label: x }))}
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
            value={formik.values.subjects.map((x) => ({ value: x, label: x }))}
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
                <span className="text-gray-500 sm:text-sm">$</span>
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
                <span className="text-gray-500 sm:text-sm">+65</span>
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
        <div className="text-center">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Create profile
          </button>
        </div>
      </form>
    </div>
  );
};

CreateProfile.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default CreateProfile;
