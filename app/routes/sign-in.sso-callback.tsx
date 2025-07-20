import { AuthenticateWithRedirectCallback } from "@clerk/react-router";

export default function SsoCallbackRoute() {
  return <AuthenticateWithRedirectCallback />;
}
