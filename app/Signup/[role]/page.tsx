"use client";
import { useState } from "react";
import { useParams } from "next/navigation"; // <-- Use Next.js, not react-router-dom!
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Signup = () => {
  const params = useParams();
  const role = params?.role || "student";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const roleName = typeof role === "string" ? role.charAt(0).toUpperCase() + role.slice(1) : "Student";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate
    const result = signupSchema.safeParse({ name, email, password });
    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role: typeof role === "string" ? role : "student",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Signup failed");
        return;
      }

      toast.success("Account created! Please login.");
      window.location.href = `/Login/${role}`;
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };


  return (

    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Professional Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-col md:flex-row items-center justify-around gap-4">
            <img
              width="240"
              height="105"
              src="https://licet.ac.in/wp-content/uploads/2021/02/licet-e1617087721530.png"
              alt="LICET Logo"
              className=""
            />
            <div className="text-center">
              <h1 className="text-3xl md:text-2xl font-bold text-foreground">
                LOYOLA-ICAM COLLEGE OF ENGINEERING AND TECHNOLOGY
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">(Autonomous)</p>
            </div>
          </div>
        </div>
      </header>

      {/* Department Banner */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 py-4 shadow-md">
        <div className="container mx-auto px-4">
          <p className="text-center text-base md:text-lg font-semibold text-white">
            DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING
          </p>
        </div>
      </section>

      {/* Signup Form */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-md mx-auto">
          <Card className="shadow-lg border-border">
            <CardHeader className="space-y-1 text-center pb-6">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-orange-500 bg-clip-text text-transparent">
                Create Account
              </CardTitle>
              <CardDescription className="text-base">
                Sign up as {role} to access the portal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={`Enter your full name`}
                    className={`h-11 transition-all ${errors.name ? "border-destructive" : ""}`}
                    required
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={`${role}@licet.ac.in`}
                    className={`h-11 transition-all ${errors.email ? "border-destructive" : ""}`}
                    required
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className={`h-11 transition-all ${errors.password ? "border-destructive" : ""}`}
                    required
                  />
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>

                <div className="flex items-center justify-center gap-2 pt-2">
                  <span className="text-sm text-muted-foreground">Already have an account?</span>
                  <Link
                    href={`/Login/${role}`}
                    className="text-sm font-medium text-blue-700 hover:text-orange-500 transition-colors"
                  >
                    Sign in
                  </Link>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-11 border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white transition-all"
                    asChild
                  >
                    <Link href="/">Back to Home</Link>
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-11 bg-gradient-to-r from-blue-700 to-blue-900 hover:opacity-90 transition-opacity text-white"
                  >
                    Create Account
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </main>
    </div>
      );
};

export default Signup;

