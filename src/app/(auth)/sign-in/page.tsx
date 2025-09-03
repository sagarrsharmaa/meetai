import { SignInView } from "@/modules/auth/ui/views/sign-in-view";

const page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-4xl">
        <SignInView />
      </div>
    </div>
  );
}

export default page;
