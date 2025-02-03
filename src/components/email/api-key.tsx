import type * as React from "react";

interface EmailTemplateProps {
  apiKey: string;
}

export const ApiKeyEmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  apiKey,
}) => {
  const docsUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api-doc`;

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        lineHeight: 1.5,
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#f4f4f4",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "20px",
          borderRadius: "5px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <header
          style={{
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          <img
            src={`${process.env.NEXT_PUBLIC_APP_URL}/namespace.png`}
            alt="Namespace Logo"
            style={{ maxWidth: "200px", height: "auto" }}
          />
        </header>

        <main>
          <h1
            style={{
              color: "#333",
              fontSize: "24px",
              marginBottom: "20px",
            }}
          >
            Your API Key
          </h1>

          <p style={{ marginBottom: "20px" }}>Hello,</p>

          <p style={{ marginBottom: "20px" }}>
            Here's your API key for Namespace Offchain Manager API:
          </p>

          <div
            style={{
              backgroundColor: "#e9e9e9",
              padding: "10px",
              borderRadius: "3px",
              fontFamily: "monospace",
              fontSize: "16px",
              marginBottom: "20px",
              wordBreak: "break-all",
            }}
          >
            {apiKey}
          </div>

          <p style={{ marginBottom: "20px" }}>To use this API key:</p>

          <ol
            style={{
              marginBottom: "20px",
              paddingLeft: "20px",
            }}
          >
            <li>Keep this key confidential and secure.</li>
            <li>
              If you suspect your key has been compromised, please remoke and
              generate a new one immediately.
            </li>
          </ol>

          <p style={{ marginBottom: "20px" }}>
            For more information on how to use your API key, please refer to our{" "}
            <a
              href={docsUrl}
              target="_blank"
              style={{ color: "#007bff", textDecoration: "none" }}
              rel="noreferrer"
            >
              documentation
            </a>
            .
          </p>
        </main>

        <footer
          style={{
            marginTop: "40px",
            textAlign: "center",
            fontSize: "12px",
            color: "#666",
          }}
        >
          <p>
            This is an automated message. Please do not reply to this email.
          </p>
          <p>
            &copy; {new Date().getFullYear()} Namespace. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};
