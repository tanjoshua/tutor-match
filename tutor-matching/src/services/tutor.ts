import instance from "./axiosInstance";

export const createTutorProfile = ({
  isPublic,
  title,
  gender,
  regions,
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
  gender: string;
  regions: string[];
  tutorName: string;
  levels: string[];
  subjects: {
    primary: string[];
    lowerSecondary: string[];
    upperSecondary: string[];
    jc: string[];
    other: string[];
  };
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
    gender,
    regions,
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
  gender,
  regions,
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
  gender: string;
  regions: string[];
  tutorName: string;
  levels: string[];
  subjects: {
    primary: string[];
    lowerSecondary: string[];
    upperSecondary: string[];
    jc: string[];
    other: string[];
  };
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
    gender,
    regions,
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

export const getTutorProfile = async ({ id }: { id: string }) => {
  const result = await instance.get(`/tutor/${id}`);
  return result.data;
};

export const getPublicTutorProfiles = async ({
  searchQuery,
  regions,
  gender,
  levels,
  subjects,
  type,
  page,
  limit,
}: {
  searchQuery?: string;
  regions?: string[];
  gender?: string[];
  levels?: string[];
  subjects?: any;
  type?: string[];
  page?: number;
  limit?: number;
}) => {
  const result = await instance.post(`/tutor/getPublicProfiles`, {
    searchQuery,
    regions,
    gender,
    levels,
    subjects,
    type,
    page,
    limit,
  });
  return result.data;
};

export const getUserTutorProfile = async () => {
  const result = await instance.get("tutor/me");
  return result.data;
};

export const getTutorLevels = async () => {
  const result = await instance.get("tutor/levels");
  return result.data;
};
