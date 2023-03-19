import instance from "./axiosInstance";

export const createTutorRequest = async ({
  name,
  contactInfo,
  postalCode,
  region,
  gender,
  level,
  levelCategory,
  subjects,
  type,
  pricing,
  availability,
  description,
}: {
  name: string;
  contactInfo: { email: string };
  postalCode: string;
  region: string;
  gender: string[];
  level: string;
  levelCategory: string;
  subjects: string[];
  type: string[];
  pricing: {
    rate: string;
    rateOption: string;
  };
  availability: string;
  description: string;
}) => {
  const result = await instance.post("/tutor/request", {
    name,
    contactInfo,
    postalCode,
    region,
    gender,
    level,
    levelCategory,
    subjects,
    type,
    pricing,
    availability,
    description,
  });

  return result.data;
};

export const replaceTutorRequest = ({
  id,
  name,
  contactInfo,
  postalCode,
  region,
  gender,
  level,
  levelCategory,
  subjects,
  type,
  pricing,
  availability,
  description,
}: {
  id: string;
  name: string;
  contactInfo: { email: string };
  postalCode: string;
  region: string;
  gender: string[];
  level: string;
  levelCategory: string;
  subjects: string[];
  type: string[];
  pricing: {
    rate: string;
    rateOption: string;
  };
  availability: string;
  description: string;
}) => {
  return instance.put("/tutor/request", {
    id,
    name,
    contactInfo,
    postalCode,
    region,
    gender,
    level,
    levelCategory,
    subjects,
    type,
    pricing,
    availability,
    description,
  });
};

export const deleteTutorRequest = ({ id }: { id: string }) => {
  return instance.delete(`/tutor/request/${id}`);
};

export const getTutorRequest = async ({ id }: { id: string }) => {
  const result = await instance.get(`/tutor/request/${id}`);
  return result.data;
};

// TODO: add more filters
export const getTutorRequests = async ({
  region,
  gender,
  levels,
  subjects,
  type,
  page,
  limit,
}: {
  region?: string[];
  gender?: string;
  levels?: string[];
  subjects?: any;
  type?: string[];
  page?: number;
  limit?: number;
}) => {
  const result = await instance.post(`/tutor/getRequests`, {
    region,
    gender,
    levels,
    subjects,
    type,
    page,
    limit,
  });
  return result.data;
};

export const applyToTutorRequest = async ({ id }: { id: string }) => {
  const result = await instance.post("/tutor/applyRequest", {
    id,
  });

  return result.data;
};

export const withdrawApplication = async ({ id }: { id: string }) => {
  const result = await instance.post("/tutor/withdrawRequest", {
    id,
  });

  return result.data;
};

export const getHasApplied = async ({ id }: { id: string }) => {
  const result = await instance.get("/tutor/applied", {
    params: {
      id,
    },
  });

  return result.data;
};

export const getTutorApplications = async ({ token }: { token: string }) => {
  const result = await instance.get("/tutor/requestClient/apps", {
    params: {
      token,
    },
  });

  return result.data;
};

export const updateTutorApplicationState = async ({
  applicationId,
  newState,
}: {
  applicationId: string;
  newState: string;
}) => {
  const result = await instance.post("/tutor/requestClient/updateAppState", {
    id: applicationId,
    state: newState,
  });

  return result.data;
};

export const getTutorApplication = async ({ id }: { id: string }) => {
  const result = await instance.get("/tutor/requestClient/application", {
    params: {
      id,
    },
  });

  return result.data;
};
