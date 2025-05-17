import React, { useState } from "react";
import FormStep from "../components/auth/FormStep";
import {
  Layers,
  ChevronRight,
  ArrowRight,
  Loader2,
  Check,
  X,
  Github,
  Twitter,
} from "lucide-react";
import { registerUser } from "../services/AuthService";
import { z } from "zod";
import { toast } from "sonner";


const SignupPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const totalSteps = 3;

  const personalInfoSchema = z.object({
    fullName: z.string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters")
      .regex(/^[a-zA-Z ]+$/, "Name can only contain letters and spaces")
      .refine(
        (val) => val.trim().length > 0 && /[a-zA-Z]/.test(val),
        "Name cannot be only spaces"
      ),
    email: z.string().email("Invalid email address")
  });
  
  const passwordSchema = z.object({
    password: z.string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[!@#$%^&*]/, "Must contain at least one special character"),
    confirmPassword: z.string()
  }).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  });
  
  const termsSchema = z.object({
    agreeToTerms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms" })
    })
  });
  
  // Integrated Validation Function
  const validateStep = (step: number, data: any) => {
    try {
      switch(step) {
        case 1:
          personalInfoSchema.parse(data);
          break;
        case 2:
          passwordSchema.parse(data);
          break;
        case 3:
          termsSchema.parse(data);
          break;
      }
      return { isValid: true, errors: {} };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.flatten().fieldErrors;
        return {
          isValid: false,
          errors: Object.fromEntries(
            Object.entries(errors).map(([key, value]) => [key, value?.[0] ?? ""])
          ) // Added missing closing parenthesis
        };
      }
      return { isValid: false, errors: {} };
    }
  };

  // const validateStep = (step: number): boolean => {
  //   const newErrors: Record<string, string> = {};

  //   if (step === 1) {
  //     if (!formData.fullName) {
  //       newErrors.fullName = "Full name is required";
  //     } else if (formData.fullName.length < 3) {
  //       newErrors.fullName = "Name must be at least 3 characters";
  //     }

  //     if (!formData.email) {
  //       newErrors.email = "Email address is required";
  //     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
  //       newErrors.email = "Please enter a valid email address";
  //     }
  //   } else if (step === 2) {
  //     if (!formData.password) {
  //       newErrors.password = "Password is required";
  //     } else if (formData.password.length < 8) {
  //       newErrors.password = "Password must be at least 8 characters";
  //     }

  //     if (!formData.confirmPassword) {
  //       newErrors.confirmPassword = "Please confirm your password";
  //     } else if (formData.confirmPassword !== formData.password) {
  //       newErrors.confirmPassword = "Passwords do not match";
  //     }
  //   } else if (step === 3) {
  //     if (!formData.agreeToTerms) {
  //       newErrors.agreeToTerms = "You must agree to the terms and conditions";
  //     }
  //   }

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  const handleNextStep = () => {
    const validation = validateStep(currentStep, formData); // Pass both arguments
    if (validation.isValid) {
      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1);
      } else {
        handleSubmit();
      }
    } else {
      setErrors(validation.errors);
    }
  };
  

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  

  const handleSubmit = async () => {
    const validation = validateStep(currentStep, formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
  
    setIsSubmitting(true);
    try {
      if (currentStep === 3) {
        const result = await registerUser({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
        });
        console.log("User registered:", result);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
      console.error("Registration failed:", error?.response?.data || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialSignup = (provider: string) => {
    console.log(`Signing up with ${provider}`);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <FormStep
            title="Personal Information"
            description="Let's get to know you better"
          >
            <div className="space-y-4">
              <div className="relative">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-white/90 mb-1.5"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border ${
                    errors.fullName ? "border-red-400" : "border-purple-400/30"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white placeholder-white/50 transition-all duration-300`}
                  placeholder="John Doe"
                />
                {errors.fullName && (
                  <div className="text-red-400 text-xs mt-1 flex items-center">
                    <X size={12} className="mr-1" />
                    {errors.fullName}
                  </div>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white/90 mb-1.5"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border ${
                    errors.email ? "border-red-400" : "border-purple-400/30"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white placeholder-white/50 transition-all duration-300`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <div className="text-red-400 text-xs mt-1 flex items-center">
                    <X size={12} className="mr-1" />
                    {errors.email}
                  </div>
                )}
              </div>
            </div>
          </FormStep>
        );
      case 2:
        return (
          <FormStep
            title="Set Your Password"
            description="Create a secure password"
          >
            <div className="space-y-4">
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-white/90 mb-1.5"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border ${
                    errors.password ? "border-red-400" : "border-purple-400/30"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white placeholder-white/50 transition-all duration-300`}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <div className="text-red-400 text-xs mt-1 flex items-center">
                    <X size={12} className="mr-1" />
                    {errors.password}
                  </div>
                )}
              </div>
              <div className="relative">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-white/90 mb-1.5"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border ${
                    errors.confirmPassword
                      ? "border-red-400"
                      : "border-purple-400/30"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white placeholder-white/50 transition-all duration-300`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <div className="text-red-400 text-xs mt-1 flex items-center">
                    <X size={12} className="mr-1" />
                    {errors.confirmPassword}
                  </div>
                )}
              </div>
              <div className="mt-2">
                <p className="text-xs text-white/70">Password strength:</p>
                <div className="w-full h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      !formData.password
                        ? "w-0"
                        : formData.password.length < 6
                        ? "w-1/4 bg-red-400"
                        : formData.password.length < 8
                        ? "w-2/4 bg-yellow-400"
                        : formData.password.length < 10
                        ? "w-3/4 bg-blue-400"
                        : z.string().min(8).safeParse(formData.password).success
                        ? "w-full bg-green-400"
                        : "w-3/4 bg-blue-400"
                    }`}
                  />
                </div>
              </div>
              
              {errors.fullName && (
                <div className="text-red-400 text-xs mt-1 flex items-center animate-fade-in">
                  <X size={12} className="mr-1 flex-shrink-0" />
                  <span className="animate-slide-up">{errors.fullName}</span>
                </div>
              )}
              
              <div className="mt-4 space-y-2 text-xs text-white/70">
                <p className="font-medium">Password Requirements:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li
                    className={`flex items-center ${
                      /^.{8,}$/.test(formData.password) ? "text-green-400" : ""
                    }`}
                  >
                    <Check size={12} className="mr-1.5 flex-shrink-0" /> At
                    least 8 characters
                  </li>
                  <li
                    className={`flex items-center ${
                      /[A-Z]/.test(formData.password) ? "text-green-400" : ""
                    }`}
                  >
                    <Check size={12} className="mr-1.5 flex-shrink-0" /> One
                    uppercase letter
                  </li>
                  <li
                    className={`flex items-center ${
                      /[0-9]/.test(formData.password) ? "text-green-400" : ""
                    }`}
                  >
                    <Check size={12} className="mr-1.5 flex-shrink-0" /> One
                    number
                  </li>
                  <li
                    className={`flex items-center ${
                      /[!@#$%^&*]/.test(formData.password)
                        ? "text-green-400"
                        : ""
                    }`}
                  >
                    <Check size={12} className="mr-1.5 flex-shrink-0" /> One
                    special character
                  </li>
                </ul>
              </div>
            </div>
          </FormStep>
        );
      case 3:
        return (
          <FormStep title="Almost Done" description="Review and confirm">
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm">
                <h4 className="text-white/90 text-sm font-medium mb-2">
                  Account Summary
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/70 text-xs">Name:</span>
                    <span className="text-white text-xs font-medium">
                      {formData.fullName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70 text-xs">Email:</span>
                    <span className="text-white text-xs font-medium">
                      {formData.email}
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative flex items-start mt-4">
                <div className="flex items-center h-5">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-white/30 bg-purple-900/50 text-purple-500 focus:ring-purple-500/50"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeToTerms" className="text-white/90">
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-purple-300 hover:text-purple-200 underline"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-purple-300 hover:text-purple-200 underline"
                    >
                      Privacy Policy
                    </a>
                  </label>
                  {errors.agreeToTerms && (
                    <div className="text-red-400 text-xs mt-1 flex items-center">
                      <X size={12} className="mr-1" />
                      {errors.agreeToTerms}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </FormStep>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-900 to-purple-800 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-tr from-indigo-400 to-cyan-400 p-4 rounded-2xl shadow-lg">
            <Layers className="text-white h-8 w-8" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Join{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Horizon
            </span>
          </h1>
          <p className="mt-2 text-white/70">Start your journey with us today</p>
        </div>

        <div className="bg-purple-900/40 backdrop-blur-md rounded-xl shadow-xl overflow-hidden border border-white/10">
          <div className="px-6 pt-6">
            <div className="relative">
              <div className="overflow-hidden h-1 mb-4 flex rounded bg-purple-700/30">
                <div
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  className="shadow-none flex flex-col whitespace-nowrap justify-center bg-gradient-to-r from-indigo-400 to-cyan-400 transition-all duration-500 ease-in-out"
                />
              </div>
              <div className="flex justify-between">
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <div key={index} className="flex items-center justify-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        currentStep > index + 1
                          ? "bg-green-400 text-green-900"
                          : currentStep === index + 1
                          ? "bg-gradient-to-r from-indigo-400 to-cyan-400 text-white"
                          : "bg-purple-700/30 text-white/50"
                      } transition-all duration-300`}
                    >
                      {currentStep > index + 1 ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <span className="text-sm">{index + 1}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6">
            {renderStepContent()}

            <div className="flex justify-between mt-8">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-2 border border-white/20 rounded-lg text-white/80 hover:bg-white/5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 text-sm"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={handleNextStep}
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 hover:from-indigo-600 hover:to-purple-600 ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                } group`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {currentStep === totalSteps ? "Complete" : "Continue"}
                    <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </button>
            </div>
          </div>

          {currentStep === 1 && (
            <div className="px-6 pb-6">
              <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink mx-3 text-white/50 text-sm">
                  Or sign up with
                </span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleSocialSignup("Google")}
                  className="flex items-center justify-center py-2.5 border border-white/20 rounded-lg hover:bg-white/5 transition-all duration-300"
                >
                  <svg
                    className="h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialSignup("GitHub")}
                  className="flex items-center justify-center py-2.5 border border-white/20 rounded-lg hover:bg-white/5 transition-all duration-300"
                >
                  <Github className="h-5 w-5 text-white" />
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialSignup("Twitter")}
                  className="flex items-center justify-center py-2.5 border border-white/20 rounded-lg hover:bg-white/5 transition-all duration-300"
                >
                  <Twitter className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-white/70">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-purple-300 hover:text-purple-200 font-medium"
            >
              Sign in
            </a>
          </p>
        </div>

        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full [filter:blur(120px)] [animation:blob_7s_infinite]" />
          <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-indigo-600/20 rounded-full [filter:blur(120px)] [animation:blob_7s_infinite_2s]" />
          <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] bg-blue-600/20 rounded-full [filter:blur(120px)] [animation:blob_7s_infinite_4s]" />
        </div>
      </div>
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default SignupPage;
