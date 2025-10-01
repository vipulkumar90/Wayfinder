import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function LoginCard() {
  return (
    <Card className="w-full max-w-md rounded-[32px] border-0 bg-white shadow-2xl px-4 py-10">
      <CardHeader className="space-y-3 text-center">
        <div className="flex flex-col items-center gap-2">
          <span className="text-4xl font-semibold text-gray-900">
            Wayfinder
          </span>
          <CardTitle className="mt-3 text-xl font-normal text-gray-800">
            Log in to Wayfinder
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label
            htmlFor="login-email"
            className="text-sm font-medium text-gray-700"
          >
            Email address
          </Label>
          <Input
            id="login-email"
            type="email"
            placeholder="name@email.com"
            className="h-12 rounded-xl border-gray-200 text-base focus:border-0 focus-visible:ring-1 focus-visible:ring-travel-primary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="login-password" className="font-medium text-gray-700">
            Password
          </Label>
          <Input
            id="login-password"
            type="password"
            placeholder="••••••••"
            className="h-12 rounded-xl border-gray-200 text-base focus:border-0 focus-visible:ring-1 focus-visible:ring-travel-primary"
          />
          <div className="flex items-center justify-between text-sm">
            <Link href="#" className="text-travel-primary transition-colors">
              Forgot password?
            </Link>
          </div>
        </div>
        <Button className="h-12 w-full rounded-lg bg-travel-primary text-base font-normal text-white transition-colors hover:bg-travel-primary/80 space-y-2 cursor-pointer">
          Continue
        </Button>
        <div className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-travel-primary transition-colors hover:text-travel-primary/80"
          >
            Sign up
          </Link>
        </div>
        <div className="relative py-3 text-center text-sm text-gray-400">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2">
            <Separator className="mx-auto w-full max-w-[85%] bg-gray-200" />
          </div>
          <span className="relative inline-flex bg-white px-3 text-gray-800">
            OR
          </span>
        </div>
        <Button
          variant="outline"
          className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border-gray-200 bg-white text-base font-normal text-gray-700 cursor-pointer"
        >
          <Image src="/google-icon.png" alt="Google" width={20} height={20} />
          Continue with Google
        </Button>
      </CardContent>
    </Card>
  );
}
