import AuthForm from "@/components/AuthForm";

export const metadata = { title: "Sign up", robots: { index: false } };

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
