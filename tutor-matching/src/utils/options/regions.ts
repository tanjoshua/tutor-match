export enum Region {
  Central = "Central",
  East = "East",
  North = "North",
  NorthEast = "North-East",
  West = "West",
  Online = "Online",
}

export const regionOptions = Object.values(Region).map((value) => ({
  label: value,
  value,
  isDisabled: value !== Region.Online,
}));
