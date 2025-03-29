import {
  Card,
  Input,
  Button,
  Spinner
} from "@heroui/react";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import loginBg from "@/public/login-bg.jpg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Call the authentication API
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Important: include credentials to allow cookie setting
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }
      
      // Redirect to home or dashboard on success
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <div className="absolute inset-0 z-0">
        <Image
          src={loginBg}
          alt="Login background"
          layout="fill"
          objectFit="cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      <Card className="relative z-10 w-full max-w-md mx-4 p-6">
        <div className="text-center mb-6">
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Input
                type="email"
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full"
              />
            </div>
            
            <div>
              <Input
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="********"
                className="w-full"
              />
            </div>
            
            <div className="text-right">
              <a href="#" className="text-blue-600 hover:underline text-sm">
                Forgot Password?
              </a>
            </div>
            
            <Button 
              type="submit" 
              variant="solid"
              color="primary" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? <Spinner size="sm" className="mr-2" /> : null}
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            
            <div className="text-center mt-4">
              <p className="text-sm">
                Don't have an account?{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;