import { Footer } from "../Footer";
import { Box } from "@chakra-ui/react";
import Navbar from "./Navbar";

const LayoutWithNav = ({ children }) => {
  return (
    <>
      <Navbar />
      <Box p="1rem">{children}</Box>
      <Footer />
    </>
  );
};

export default LayoutWithNav;
