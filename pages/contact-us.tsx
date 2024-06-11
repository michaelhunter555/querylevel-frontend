import React from "react";

import dynamic from "next/dynamic";

import LinearProgress from "@mui/material/LinearProgress";

const ContactForm = dynamic(
  () => import("@/components/ContactForm/ContactForm"),
  { ssr: false, loading: () => <LinearProgress /> }
);

const ContactUs = () => {
  return <ContactForm />;
};

export default ContactUs;
