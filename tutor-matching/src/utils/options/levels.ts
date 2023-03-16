export const PrimaryLevels = [
  "Primary 1",
  "Primary 2",
  "Primary 3",
  "Primary 4",
  "Primary 5",
  "Primary 6",
];

export const LowerSecondaryLevels = [
  // Sec 1
  "Secondary 1 (Express)",
  "Secondary 1 (Normal Academic)",
  "Secondary 1 (Normal Technical)",
  "Secondary 1 (Integrated Program)",

  // Sec 2
  "Secondary 2 (Express)",
  "Secondary 2 (Normal Academic)",
  "Secondary 2 (Normal Technical)",
  "Secondary 2 (Integrated Program)",
];

export const UpperSecondaryLevels = [
  // Sec 3
  "Secondary 3 (Express)",
  "Secondary 3 (Normal Academic)",
  "Secondary 3 (Normal Technical)",
  "Secondary 3 (Integrated Program)",

  // Sec 4
  "Secondary 4 (Express)",
  "Secondary 4 (Normal Academic)",
  "Secondary 4 (Normal Technical)",
  "Secondary 4 (Integrated Program)",
];

export const JCLevels = [
  "Junior College 1 (JC1)",
  "Junior College 2 (JC2)",
  "MI Year 3",
];

export const levelOptions = [
  {
    label: "Primary",
    options: PrimaryLevels.map((level) => ({
      label: level,
      value: level,
    })),
  },
  {
    label: "Lower Secondary",
    options: LowerSecondaryLevels.map((level) => ({
      label: level,
      value: level,
    })),
  },
  {
    label: "Upper Secondary",
    options: UpperSecondaryLevels.map((level) => ({
      label: level,
      value: level,
    })),
  },
  {
    label: "JC",
    options: JCLevels.map((level) => ({
      label: level,
      value: level,
    })),
  },
];

export enum LevelCategories {
  Primary = "Primary",
  LowerSecondary = "Lower Secondary",
  UpperSecondary = "Upper Secondary",
  JC = "JC",
  Other = "Other",
}

export const levelCategoryOptions = Object.values(LevelCategories).map(
  (value) => ({ label: value, value })
);
