import instance from "./axiosInstance";

export const contactTutorFromBrowse = ({
  name,
  email,
  phoneNumber,
  message,
  profileId,
}: {
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
  profileId: string;
}) => {
  return instance.post("/tutor/contact/browse", {
    name,
    email,
    phoneNumber,
    message,
    profileId,
  });
};

export const contactTutorFromRequest = ({}: {}) => {
  return instance.post("/tutor/contact/tutorRequest", {});
};
