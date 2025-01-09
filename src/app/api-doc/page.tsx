"use client";
import { ApiReferenceReact } from "@scalar/api-reference-react";
import "@scalar/api-reference-react/style.css";

export default function Page() {
  return (
    <ApiReferenceReact
      configuration={{
        spec: {
          url: "http://localhost:3000/openapi.json",
        },
      }}
    />
  );
}
