import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#0A3323] flex flex-col items-center justify-center p-6">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-4xl font-black tracking-tighter text-[#F7F4D5] mb-2">
          Weave.
        </h1>
      </div>

      <SignUp 
        routing="path" 
        path="/sign-up" 
        forceRedirectUrl="/onboarding"
        appearance={{
          elements: {
            formButtonPrimary: "bg-[#F7F4D5] text-[#0A3323] hover:bg-[#F7F4D5]/90",
            card: "bg-[#0D3B22] border border-[#F7F4D5]/10",
            // ... Copy the rest of the appearance object from above to stay consistent!
          }
        }}
      />
    </div>
  );
}