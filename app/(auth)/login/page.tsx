import AuthForm from "../../components/auth-form";

export default function LoginPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-center mb-6">Welcome back</h1>
      <AuthForm mode="login" />
    </div>
  );
}
