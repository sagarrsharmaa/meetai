05-auth-socials
import { SignInView } from "@/modules/auth/ui/views/sign-in-view";
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
        <SignInView />
      </div>
    </div>
  );
}

export default page;

