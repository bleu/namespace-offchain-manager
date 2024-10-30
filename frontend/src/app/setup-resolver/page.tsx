"use client";
import React from "react";
import SetupResolver from "./(components)/SetupResolver";

const Page = () => {
  const [resolver, setResolver] = React.useState(
    "0x1234567891234567891234567891234567891234567",
  );
  const [error, setError] = React.useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic validation for hex address format
    if (!/^0x[0-9a-fA-F]+$/.test(resolver)) {
      setError(
        "Invalid resolver address format. Must start with 0x and contain only hexadecimal characters.",
      );
      return;
    }

    setError("");
    console.log("Submitted resolver:", resolver);
  };

  return (
    <SetupResolver
      resolver={resolver}
      error={error}
      setResolver={setResolver}
      handleSubmit={handleSubmit}
    />
  );
};

export default Page;
