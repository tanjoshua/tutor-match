import {
  Dispatch,
  Fragment,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useQuery } from "react-query";
import { getTutorApplication } from "@/services/tutorRequest";
import { ApplicationState } from "@/utils/enums";
import { PhoneIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Dropzone from "react-dropzone";
import Cropper, { Area } from "react-easy-crop";
import { toast } from "react-hot-toast";
import { uploadProfilePicture } from "@/services/tutor";

export default function UploadProfilePicModal({
  open,
  setOpen,
  refetch,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  refetch: Function;
}) {
  const [image, setImage] = useState<File>();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      console.log(croppedArea, croppedAreaPixels);
    },
    []
  );

  const uploadImage = async () => {
    // upload image
    if (image) {
      const result = await uploadProfilePicture(image);
      refetch();
      return result;
    }
    return null;
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
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
                <div className="relative px-4 py-3">
                  <Dropzone
                    onDrop={(acceptedFiles) => {
                      if (acceptedFiles.length > 0) {
                        setImage(acceptedFiles[0]);
                      }
                    }}
                    accept={{
                      "image/jpeg": [],
                      "image/png": [],
                    }}
                    maxFiles={1}
                    maxSize={2000000}
                    multiple={false}
                  >
                    {({
                      getRootProps,
                      getInputProps,
                      acceptedFiles,
                      fileRejections,
                    }) => (
                      <div className="px-5 py-6 cursor-pointer">
                        {acceptedFiles.length > 0 ? (
                          <div className="w-96 h-96">
                            <Cropper
                              image={image && URL.createObjectURL(image)}
                              crop={crop}
                              zoom={zoom}
                              aspect={1 / 1}
                              onCropChange={setCrop}
                              onCropComplete={onCropComplete}
                              onZoomChange={setZoom}
                              classes={{
                                containerClassName: "mt-10",
                                mediaClassName: "",
                              }}
                            />
                          </div>
                        ) : (
                          <div
                            {...getRootProps({
                              className:
                                "py-6 px-4 border-2 border-dotted bg-gray-100 text-gray-400 focus:outline-none",
                            })}
                          >
                            <input
                              {...getInputProps({
                                className: "",
                              })}
                            />
                            <p>
                              Drag 'n' drop your image here, or click to select
                              file
                            </p>
                          </div>
                        )}
                        {fileRejections.length > 0 && (
                          <div className="mt-1 text-red-400">
                            {fileRejections[0].errors[0].message}
                          </div>
                        )}
                      </div>
                    )}
                  </Dropzone>
                  <div className="absolute right-2 top-2">
                    <button
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      <XMarkIcon className="h-6 w-6 text-gray-500 hover:text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                    onClick={() => {
                      setOpen(false);
                      toast.promise(uploadImage(), {
                        loading: "Uploading",
                        success: "Image uploaded",
                        error: "Error uploading",
                      });
                    }}
                  >
                    Upload
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
