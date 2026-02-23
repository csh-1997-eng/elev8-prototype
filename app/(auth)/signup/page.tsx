import AuthForm from "../../components/auth-form";

export default function SignupPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-center mb-6">
        Create your account
      </h1>
      <AuthForm mode="signup" />
    </div>
  );
}
