import { createCivicAuthPlugin } from "@civic/auth/nextjs"
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

const withCivicAuth = createCivicAuthPlugin({
  clientId: "63ec77c4-5378-4108-807e-ad64955997f3"
});

export default withCivicAuth(nextConfig)