import LoginForm from "./LoginForm";

export const metadata = { title: "Admin Login — Iconix Nail Bar" };

export default function LoginPage() {
  return (
    <div className="fixed inset-0 z-[9999] bg-warm-cream flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white border border-almond rounded-2xl p-8 shadow-sm">
        {/* Header */}
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">
            Iconix Admin
          </p>
          <h1 className="font-display text-2xl text-deep-berry">Sign In</h1>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
