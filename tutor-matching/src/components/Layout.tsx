import React from "react";
import Navbar from "./shared/Navbar";

type Props = {children: any};

const Layout = (props: Props) => {
  return (
    <>
      <Navbar />
      <main>{props.children}</main>
    </>
  );
};

export default Layout;
