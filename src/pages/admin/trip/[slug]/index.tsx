"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../../../../components/tabs";
import { cn } from "../../../../lib/utils";
import { RegistrationStatsContainer } from "../../../../containers/registrationStats";
import { PaymentStatsContainer } from "../../../../containers/paymentsStats";
import { VerificationList } from "../../../../containers/verification";
import { PaidListContainer } from "../../../../containers/paidList";
import { RegistrationsList } from "@/containers/registeredList";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("stats");
  const [activeSection, setActiveSection] = useState("registrations");

  return (
    <div className="max-w-md mx-auto pb-8">
      <header className="sticky top-0 bg-white z-10">
        <Tabs
          defaultValue="stats"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="w-full grid grid-cols-4 h-12">
            <TabsTrigger
              value="stats"
              className={cn(
                "py-3 flex justify-center",
                activeTab === "stats" && "border-b-2 border-black"
              )}
            >
              Stats
            </TabsTrigger>
            <TabsTrigger
              value="registration"
              className={cn(
                "py-3 flex justify-center",
                activeTab === "registration" && "border-b-2 border-black"
              )}
            >
              Registration
            </TabsTrigger>
            <TabsTrigger
              value="verification"
              className={cn(
                "py-3 flex justify-center",
                activeTab === "verification" && "border-b-2 border-black"
              )}
            >
              Verification
            </TabsTrigger>
            <TabsTrigger
              value="paid"
              className={cn(
                "py-3 flex justify-center",
                activeTab === "paid" && "border-b-2 border-black"
              )}
            >
              Paid
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* {activeTab === "stats" && (
          <div className="grid grid-cols-2 border-b">
            <button
              className={cn(
                "py-3 text-center font-medium",
                activeSection === "registrations" && "border-b-2 border-black"
              )}
              onClick={() => setActiveSection("registrations")}
            >
              Registrations
            </button>
            <button
              className={cn(
                "py-3 text-center font-medium",
                activeSection === "payments" && "border-b-2 border-black"
              )}
              onClick={() => setActiveSection("payments")}
            >
              Payments
            </button>
          </div>
        )} */}
      </header>
      {activeTab === "stats" && activeSection === "registrations" && (
        <RegistrationStatsContainer />
      )}
      {activeTab === "stats" && activeSection === "payments" && (
        <PaymentStatsContainer />
      )}
      {activeTab === "registration" && <RegistrationsList />}
      {activeTab === "verification" && <VerificationList />}
      {activeTab === "paid" && <PaidListContainer />}
    </div>
  );
}
