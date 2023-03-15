import {
  JCLevels,
  LowerSecondaryLevels,
  PrimaryLevels,
  UpperSecondaryLevels,
} from "./levels";

const PrimarySubjects = [
  "English",
  "Math",
  "Science",
  "Chinese",
  "Malay",
  "Tamil",
  "Hindi",
];

const LowerSecondarySubjects = [
  "English",
  "Math",
  "Science",
  "History",
  "Geography",
  "Social Studies",
  "Literature",
  "Chinese",
  "Tamil",
  "Malay",
  "Hindi",
];

const UpperSecondarySubjects = [
  "English",
  "E Math",
  "A Math",
  "Science",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Geography",
  "Social Studies",
  "Literature",
  "Chinese",
  "Tamil",
  "Malay",
  "Hindi",
  "Principle of Accounts",
];

const JCSubjects = [
  "General Paper",
  "Knowledge and Inquiry",
  "Math",
  "Physics",
  "Chemistry",
  "Biology",
  "Economics",
  "History",
  "Geography",
  "Literature",
  "Computing",
  "Art",
  "Chinese",
  "Tamil",
  "Malay",
  "Hindi",
  "Principle of Accounts",
];

export const PrimarySubjectOptions = PrimarySubjects.map((subject) => ({
  label: subject,
  value: subject,
}));
export const LowerSecondarySubjectOptions = LowerSecondarySubjects.map(
  (subject) => ({
    label: subject,
    value: subject,
  })
);
export const UpperSecondarySubjectOptions = UpperSecondarySubjects.map(
  (subject) => ({
    label: subject,
    value: subject,
  })
);
export const JCSubjectOptions = JCSubjects.map((subject) => ({
  label: subject,
  value: subject,
}));

// helper functions
export const getSubjectOptions = (level: string) => {
  if (PrimaryLevels.includes(level)) {
    return PrimarySubjectOptions;
  } else if (LowerSecondaryLevels.includes(level)) {
    return LowerSecondarySubjectOptions;
  } else if (UpperSecondaryLevels.includes(level)) {
    return UpperSecondarySubjectOptions;
  } else if (JCLevels.includes(level)) {
    return JCSubjectOptions;
  } else {
    return [];
  }
};
