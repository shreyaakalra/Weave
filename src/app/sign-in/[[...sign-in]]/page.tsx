import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#0A3323] flex flex-col items-center justify-center p-6">
      {/* Brand Header */}
      <div className="mb-8 text-center">
        <h1 className="font-serif text-4xl font-black tracking-tighter text-[#F7F4D5] mb-2">
          Weave.
        </h1>
        <p className="text-[#F7F4D5]/60 text-sm tracking-wide">
          Welcome back to the graph.
        </p>
      </div>

      {/* Clerk Sign In Component */}
      <SignIn 
        routing="path" 
        path="/sign-in" 
        // This ensures they go straight to onboarding after signing in
        forceRedirectUrl="/onboarding" 
        appearance={{
          elements: {
            formButtonPrimary: "bg-[#F7F4D5] text-[#0A3323] hover:bg-[#F7F4D5]/90 border-none shadow-none",
            card: "bg-[#0D3B22] border border-[#F7F4D5]/10 shadow-2xl",
            headerTitle: "text-[#F7F4D5]",
            headerSubtitle: "text-[#F7F4D5]/60",
            socialButtonsBlockButton: "bg-transparent border border-[#F7F4D5]/20 text-[#F7F4D5] hover:bg-[#F7F4D5]/5",
            socialButtonsBlockButtonText: "text-[#F7F4D5]",
            dividerLine: "bg-[#F7F4D5]/10",
            dividerText: "text-[#F7F4D5]/40",
            formFieldLabel: "text-[#F7F4D5]/80",
            formFieldInput: "bg-[#0A3323] border-[#F7F4D5]/20 text-[#F7F4D5] focus:border-[#F7F4D5]/50",
            footerActionText: "text-[#F7F4D5]/60",
            footerActionLink: "text-[#F7F4D5] hover:text-[#F7F4D5]/80",
            identityPreviewText: "text-[#F7F4D5]",
            identityPreviewEditButtonIcon: "text-[#F7F4D5]"
          }
        }}
      />
    </div>
  );
}