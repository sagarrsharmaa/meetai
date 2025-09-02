 import { Card , CardContent } from "@/components/ui/card"
import { SignUpView } from "@/modules/auth/ui/views/sign-up-view";
import { Sign } from "crypto";

const page = () => {
  console.log("sign up page");
  return <SignUpView />;  

} 
export default page;