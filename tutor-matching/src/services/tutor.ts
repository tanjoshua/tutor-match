import instance from "./axiosInstance";

export const createTutorProfile = ({
  isPublic,
  title,
  tutorName,
  levels,
  subjects,
  type,
  qualifications,
  description,
  pricing,
  contactInfo,
}: {
  isPublic: boolean;
  title: string;
  tutorName: string;
  levels: string[];
  subjects: string[];
  type: string;
  qualifications: string;
  description: string;
  pricing: { rate: string; details: string };
  contactInfo: { phoneNumber?: string; email?: string };
}) => {
  return instance.post("/tutor", {
    isPublic,
    title,
    tutorName,
    levels,
    subjects,
    type,
    qualifications,
    description,
    pricing,
    contactInfo,
  });
};

export const replaceTutorProfile = ({
  id,
  isPublic,
  title,
  tutorName,
  levels,
  subjects,
  type,
  qualifications,
  description,
  pricing,
  contactInfo,
}: {
  id: string;
  isPublic: boolean;
  title: string;
  tutorName: string;
  levels: string[];
  subjects: string[];
  type: string;
  qualifications: string;
  description: string;
  pricing: { rate: string; details: string };
  contactInfo: { phoneNumber?: string; email?: string };
}) => {
  return instance.put("/tutor", {
    id,
    isPublic,
    tutorName,
    title,
    levels,
    subjects,
    type,
    qualifications,
    description,
    pricing,
    contactInfo,
  });
};

export const deleteTutorProfile = ({ id }: { id: string }) => {
  return instance.delete(`/tutor/${id}`);
};

export const getTutorProfile = ({ id }: { id: string }) => {
  return instance.delete(`/tutor/${id}`);
};

export const getPublicTutorProfiles = ({
  searchQuery,
  levelFilter,
}: {
  searchQuery?: string;
  levelFilter?: string[];
}) => {
  return instance.get(`/tutor`, {
    params: { search: searchQuery, level: levelFilter },
  });
};

export const getUserTutorProfile = async () => {
  const result = await instance.get("tutor/me");
  return result.data;
};

export const getTutorLevels = async () => {
  const result = await instance.get("tutor/levels");
  return result.data;
};
