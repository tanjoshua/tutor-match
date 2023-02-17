import instance from "./axiosInstance";

export const createTutorProfile = ({
  title,
  levels,
  subjects,
  type,
  qualifications,
  description,
  pricing,
  contactInfo,
}: {
  title: string;
  levels: string[];
  subjects: string[];
  type: string;
  qualifications: string;
  description: string;
  pricing: { rate: number; details: string };
  contactInfo: { phoneNumber?: number; email?: string };
}) => {
  return instance.post("/tutor", {
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

export const replaceTutorProfile = ({
  id,
  title,
  levels,
  subjects,
  type,
  qualifications,
  description,
  pricing,
  contactInfo,
}: {
  id: string;
  title: string;
  levels: string[];
  subjects: string[];
  type: string;
  qualifications: string;
  description: string;
  pricing: { rate: number; details: string };
  contactInfo: { phoneNumber?: number; email?: string };
}) => {
  return instance.put("/tutor", {
    id,
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

export const getUserTutorProfile = () => {
  return instance.get("tutor/me");
};
