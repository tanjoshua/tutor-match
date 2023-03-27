import {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Dialog, Transition } from "@headlessui/react";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { classNames } from "@/utils/helpers";
import WhatsappImage from "../../assets/contact/WhatsAppButtonWhiteLarge.svg";
import TeleLogo from "../../assets/contact/telelogo.svg";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { contactTutorFromBrowse } from "@/services/contact";

export default function ContactModal({
  open,
  contactInfo,
  prefill,
  profileId,
  setOpen,
}: {
  open: boolean;
  contactInfo: any;
  prefill?: any;
  profileId: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const cancelButtonRef = useRef(null);
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
      message: "",
    },
    onSubmit: async (values) => {
      try {
        await contactTutorFromBrowse({ ...values, profileId });
        toast.success("Message sent");
        setOpen(false);
      } catch (e) {
        toast.error("Could not send contact form");
      }
    },
  });

  useEffect(() => {
    formik.setValues({
      name: prefill?.name ? prefill.name : "",
      email: prefill?.email ? prefill.email : "",
      phoneNumber: prefill?.phoneNumber ? prefill.phoneNumber : "",
      message: prefill?.message ? prefill.message : "",
    });
  }, [contactInfo]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all md:m-8 max-w-6xl">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 md:flex md:space-x-4">
                  <div className="absolute right-2 top-2">
                    <button
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      <XMarkIcon className="h-6 w-6 text-gray-500 hover:text-gray-400" />
                    </button>
                  </div>

                  <div>
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <PhoneIcon
                          className="h-6 w-6 text-gray-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          Contact tutor
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Reach out directly or fill in a contact request.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 space-y-4 flex flex-col items-center border-t">
                      {contactInfo.phoneNumber && (
                        <a
                          href={`https://wa.me/65${
                            contactInfo.phoneNumber
                          }?text=${encodeURIComponent(
                            "Hello, I saw your profile on tutoring.sg and am interested in engaging your services."
                          )}`}
                          target="_blank"
                          className="hover:opacity-80"
                        >
                          <Image src={WhatsappImage} alt="whatsapp" />
                        </a>
                      )}
                      {contactInfo.telegram && (
                        <a
                          href={`https://t.me/${contactInfo.telegram}`}
                          target="_blank"
                          className="flex items-center text-blue-500 hover:opacity-80 font-medium p-2"
                        >
                          <Image src={TeleLogo} height={32} alt="telegram" />
                          <div className="ml-2 ">Chat on Telegram</div>
                        </a>
                      )}
                      {contactInfo.email && (
                        <a
                          href={`mailto:${
                            contactInfo.email
                          }?subject=${encodeURIComponent(
                            "Client inquiry - tutoring.sg"
                          )}`}
                          target="_blank"
                          className="flex items-center font-medium text-gray-700 hover:opacity-80 p-2"
                        >
                          <EnvelopeIcon className="h-6" />
                          <div className="ml-2">Send Email</div>
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex md:flex-col items-center">
                    <div className="flex-grow border-t md:border-l flex-1"></div>
                    <div className="m-2 self-center text-gray-500 text-sm">
                      OR
                    </div>
                    <div className="flex-grow border-t md:border-l flex-1"></div>
                  </div>
                  <div>
                    <form
                      className="mt-2 md:mt-0"
                      onSubmit={formik.handleSubmit}
                    >
                      <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <label
                            htmlFor="name"
                            className="block text-sm font-semibold leading-6 text-gray-900"
                          >
                            Your name
                          </label>
                          <div className="mt-2.5">
                            <input
                              type="text"
                              name="name"
                              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:indigo-blue-500 focus:border-indigo-500 focus:outline-none block w-full p-2.5"
                              onChange={formik.handleChange}
                              value={formik.values.name}
                              required
                            />
                          </div>
                        </div>
                        <div className="">
                          <label
                            htmlFor="email"
                            className="block text-sm font-semibold leading-6 text-gray-900"
                          >
                            Your Email
                          </label>
                          <div className="mt-2.5">
                            <input
                              type="email"
                              name="email"
                              autoComplete="email"
                              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:indigo-blue-500 focus:border-indigo-500 focus:outline-none block w-full p-2.5"
                              onChange={formik.handleChange}
                              value={formik.values.email}
                              required
                            />
                          </div>
                        </div>
                        <div className="">
                          <label
                            htmlFor="email"
                            className="block text-sm font-semibold leading-6 text-gray-900"
                          >
                            Your Phone (optional)
                          </label>
                          <div className="mt-2.5">
                            <input
                              type="tel"
                              name="phoneNumber"
                              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:indigo-blue-500 focus:border-indigo-500 focus:outline-none block w-full p-2.5"
                              onChange={formik.handleChange}
                              value={formik.values.phoneNumber}
                            />
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <label
                            htmlFor="message"
                            className="block text-sm font-semibold leading-6 text-gray-900"
                          >
                            Message (optional) <br />
                            <span className="text-sm text-gray-500">
                              or indicate another form of contact
                            </span>
                          </label>
                          <div className="mt-2.5">
                            <textarea
                              name="message"
                              rows={4}
                              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:indigo-blue-500 focus:border-indigo-500 focus:outline-none block w-full p-2.5"
                              onChange={formik.handleChange}
                              placeholder="eg. Indicate your availability for the first lesson"
                              value={formik.values.message}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <button
                          type="submit"
                          className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Let's chat
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
