import { SignUpView } from "@/modules/auth/ui/views/sign-up-view";

const page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-4xl">
        <SignUpView />
      </div>
    </div>
  );
}

export default page;
