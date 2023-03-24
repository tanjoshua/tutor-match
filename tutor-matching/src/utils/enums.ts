// MAKE SURE THAT ENUMS ARE SYNCED WITH THE BACKEND
export enum Level {
  // Primary
  Pri1 = "Primary 1",
  Pri2 = "Primary 2",
  Pr3 = "Primary 3",
  Pri4 = "Primary 4",
  Pri5 = "Primary 5",
  Pri6 = "Primary 6",

  // Sec 1
  Sec1Express = "Secondary 1 (Express)",
  Sec1NA = "Secondary 1 (Normal Academic)",
  Sec1NT = "Secondary 1 (Normal Technical)",
  Sec1IP = "Secondary 1 (Integrated Program)",

  // Sec 2
  Sec2Express = "Secondary 2 (Express)",
  Sec2NA = "Secondary 2 (Normal Academic)",
  Sec2NT = "Secondary 2 (Normal Technical)",
  Sec2IP = "Secondary 2 (Integrated Program",

  // Sec 3
  Sec3Express = "Secondary 3 (Express)",
  Sec3NA = "Secondary 3 (Normal Academic)",
  Sec3NT = "Secondary 3 (Normal Technical)",
  Sec3IP = "Secondary 3 (Integrated Program",

  // Sec 4
  Sec4Express = "Secondary 4 (Express)",
  Sec4NA = "Secondary 4 (Normal Academic)",
  Sec4NT = "Secondary 4 (Normal Technical)",
  Sec4IP = "Secondary 4 (Integrated Program",

  // JC
  JC1 = "Junior College 1 (JC1)",
  JC2 = "Junior College 2 (JC2)",
  JC3 = "MI Year 3",

  // TODO: add more
}

export enum TutorType {
  PartTime = "Part-Time Tutor",
  FullTime = "Full-Time Tutor",
  MOE = "Ex/Current MOE Tutor",
}

export enum RateOptions {
  Quote = "Quote me",
  Max = "Indicate max rate",
  Market = "Market rate",
}

export enum ApplicationState {
  Pending = "Pending",
  Shortlisted = "Shortlisted",
  Hidden = "Hidden",
}
