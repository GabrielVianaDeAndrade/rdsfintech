"use client";

import { useState } from "react";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { LoanSimulator } from "./LoanSimulator";
import { ValueProps } from "./ValueProps";
import { Footer } from "./Footer";
import { SignupModal } from "./SignupModal";

export function LandingClient() {
  const [signupOpen, setSignupOpen] = useState(false);

  return (
    <>
      <Header onOpenSignup={() => setSignupOpen(true)} />
      <main>
        <Hero onOpenSignup={() => setSignupOpen(true)} />
        <LoanSimulator onSimulate={() => setSignupOpen(true)} />
        <ValueProps />
      </main>
      <Footer />
      <SignupModal open={signupOpen} onClose={() => setSignupOpen(false)} />
    </>
  );
}
