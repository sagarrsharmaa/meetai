import { SignUpView } from "@/modules/auth/ui/views/sign-up-view";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


const page = async () => {
  const session = await auth.api.getSession({
      headers: await headers(), 
    });
      if(!!session) {
      redirect("/");
      }
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-4xl">
        <SignUpView />
      </div>
    </div>
  );
}

export default page;