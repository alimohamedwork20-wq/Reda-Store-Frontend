import CheckCode from "./CheckCode";

export default function CheckCodeToResetPassword() {
  return (
    <CheckCode
      props={{
        title: "Reset Password",
        submitButtonText: "Confirm",
        url: "/reset-password",
      }}
    />
  );
}
