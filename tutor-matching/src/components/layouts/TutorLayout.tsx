import React from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "../shared/Navbar";

type Props = { children: any };

const TutorLayout = (props: Props) => {
  return (
    <>
      <Navbar />
      <Toaster />
      <main>{props.children}</main>
    </>
  );
};

export default TutorLayout;
