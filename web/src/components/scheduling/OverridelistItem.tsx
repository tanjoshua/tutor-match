import React from "react";

type Props = {
  scheduleOverride: {
    day: string;
    timeslots: { startTime: string; endTime: string }[];
  };
};

const OverrideListItem = (props: Props) => {
  return <div>Override</div>;
};

export default OverrideListItem;
