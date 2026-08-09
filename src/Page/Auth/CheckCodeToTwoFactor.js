import CheckCode from "./CheckCode";

export default function CheckCodeToTwoFactor() {
  return (
    <CheckCode
      props={{
        title: "Two-Factor Authentication",
        submitButtonText: "Verify",
        url: "/",
      }}
    />
  );
}
