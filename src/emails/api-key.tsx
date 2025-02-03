import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  CodeInline,
  Img,
  Button,
  Tailwind,
} from "@react-email/components";

interface EmailTemplateProps {
  apiKey: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";

export const ApiKeyEmailTemplate = ({ apiKey }: EmailTemplateProps) => {
  const docsUrl = `${baseUrl}/api-doc`;
  const previewText = "Your Namespace API Key";

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src="https://app.namespace.tech/static/media/ninja-logo.ebbab21cbfa3630a1ade.png" // {`${baseUrl}/namespace.png`}
                alt="Namespace Logo"
                className="my-0 mx-auto max-w-[100px]"
              />
            </Section>

            <Section className="mt-[32px] mb-[32px] text-center">
              <Text className="text-black text-[24px] font-normal p-0 my-0 mx-0">
                Your Namespace <strong>API Key</strong>
              </Text>
            </Section>

            <Text className="text-black text-[14px] leading-[24px]">
              Hello,
            </Text>

            <Text className="text-black text-[14px] leading-[24px]">
              Here's your API key for the{" "}
              <strong>Namespace Offchain Manager API</strong>:
            </Text>

            <Section className="my-[32px] text-left bg-[#f6f6f6] p-4 ">
              <CodeInline className="rounded-sm text-[14px] font-mono break-all">
                {apiKey}
              </CodeInline>
            </Section>

            <Text className="text-black text-[14px] leading-[24px]">
              <strong>To use this API key:</strong>
            </Text>

            <Text className="text-black text-[14px] leading-[24px] ml-4">
              1. Keep this key confidential and secure
              <br />
              2. Revoke immediately if compromised
            </Text>

            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={docsUrl}
              >
                View Documentation
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ApiKeyEmailTemplate.PreviewProps = {
  apiKey: "nsoma_111111111111111111111111111111111111111111111111",
} as EmailTemplateProps;

export default ApiKeyEmailTemplate;
