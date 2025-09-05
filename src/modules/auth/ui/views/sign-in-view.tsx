
"use client";
import { set, z } from "zod";
import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { OctagonAlertIcon } from "lucide-react";
import { FaGithub , FaGoogle } from "react-icons/fa";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Card, CardContent } from "@/components/ui/card";
import { se } from "date-fns/locale";
import { on } from "events";

const formSchema = z.object({
  email: z.string().email({message: "Invalid email"}),
  password: z.string().min(1, { message: "Password is required" }),
});

export const SignInView = () => {
  const router = useRouter();
  const[error , setError] = useState<string | null>(null);
  const[pending , setPending] = useState(false);  
  


 
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
    const onSubmit = (data: z.infer<typeof formSchema>) => {
   setError(null);
   setPending(true);

   authClient.signIn.email(
    {
        email : data.email,
        password : data.password,
        callbackURL: "/",
    }, 
    {
        onSuccess : () => {
          setPending(false);
          router.push("/");
        },
        onError : ({ error }) => {
            setError(error.message);
        }
     }
   ); 
 };

   const onSocial = (provider: "github" | "google")  => {
   setError(null);
   setPending(true);

   authClient.signIn.social(
    {
        provider: provider,
        callbackURL: "/",
    }, 
    {
        onSuccess : () => {
          setPending(false);
      },
        onError : ({ error }) => {
            setError(error.message);
        }
     }
   ); 
 };

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-muted-foreground text-balance">
                    Login to your account
                  </p>
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="m@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-destructive"/>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                {!!error && (
                  <Alert variant="destructive" className="bg-destructive/10 border-none">
                    <OctagonAlertIcon className="h-4 w-4 !text-destructive" />
                    <AlertTitle>{ error }</AlertTitle>
                  </Alert>
                )}
                <Button
                  disabled={pending}
                  type="submit"
                  className="w-full bg-black text-white hover:bg-white hover:text-black border border-black transition-colors duration-300 px-4 py-2 rounded-md text-lg font-medium"
                >
                  Sign in
                </Button>

                {/* Fixed divider */}
                <div className="relative flex items-center">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-4 text-muted-foreground text-sm">
                    Or continue with
                  </span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button disabled= {pending}
                    onClick={() => {
                    onSocial("google");
                  }}
                   variant="outline"
                    type="button"
                     className="w-full">
                    <FaGoogle />
                  </Button>
                  <Button disabled={pending}
                   onClick={() => {
                    onSocial("github");
                  }}
                   variant="outline" 
                   type="button"
                   className="w-full">
                   <FaGithub />
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/sign-up"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
          </Form>

          <div className="bg-gradient-to-br from-[#1a2e1a] to-green-900 relative hidden md:flex flex-col gap-y-4 items-center justify-center">
            <img
              src="/logo.svg"
              alt="Image"
              className="h-[92px] w-[92px]"
            />
            <p className="text-2xl font-semibold text-white">Meet.AI</p>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our{" "}
        <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
};