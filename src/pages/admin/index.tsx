"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/tabs";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { FlagshipService } from "@/services/flagshipService";
import { IFlagship } from "@/services/types/flagship";
import { UserService } from "@/services/userService";
import { IUser } from "@/services/types/user";
import { PaymentService } from "@/services/paymentService";
import { IPayment, IRefund } from "@/services/types/payment";
import { TripsContainer } from "@/containers/tripsContainer";
import { UsersContainer } from "@/containers/usersContainer";
import { PaymentsContainer } from "@/containers/paymentsContainer";
import { RefundsContainer } from "@/containers/refundsContainer";
import withAuth from "@/hoc/withAuth";
import { ROLES } from "@/config/constants";
import { useRouter } from "next/navigation";

function AdminMainPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("trips");
  const [activeSection, setActiveSection] = useState("past");
  const [trips, setTrips] = useState<{
    past: IFlagship[];
    live: IFlagship[];
    upcoming: IFlagship[];
  }>({
    past: [],
    live: [],
    upcoming: [],
  });
  const [users, setUsers] = useState<{
    unverified: IUser[];
    pendingVerification: IUser[];
    verified: IUser[];
  }>({
    unverified: [],
    pendingVerification: [],
    verified: [],
  });
  const [payments, setPayments] = useState<{
    pending: IPayment[];
    completed: IPayment[];
    refunds: IRefund[];
  }>({
    pending: [],
    completed: [],
    refunds: [],
  });
  const [loading, setLoading] = useState(false);
  const [loadingCreateFlagship, setLoadingCreateFlagship] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          pastTrips,
          liveTrips,
          upcomingTrips,
          unverifiedUsers,
          pendingUsers,
          verifiedUsers,
          pendingPayments,
          completedPayments,
          refunds,
        ] = await Promise.all([
          FlagshipService.getPastTrips(),
          FlagshipService.getLiveTrips(),
          FlagshipService.getUpcomingTrips(),
          UserService.getUnverifiedUsers(),
          UserService.getPendingVerificationUsers(),
          UserService.getVerifiedUsers(),
          PaymentService.getPendingPayments(),
          PaymentService.getCompletedPayments(),
          PaymentService.getRefunds(),
        ]);

        setTrips({
          past: pastTrips,
          live: liveTrips,
          upcoming: upcomingTrips,
        });

        setUsers({
          unverified: unverifiedUsers,
          pendingVerification: pendingUsers,
          verified: verifiedUsers,
        });

        setPayments({
          pending: pendingPayments,
          completed: completedPayments,
          refunds: refunds,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRefundAction = async (
    id: string,
    action: "approve" | "reject"
  ) => {
    try {
      if (action === "approve") {
        await PaymentService.approveRefund(id);
      } else {
        await PaymentService.rejectRefund(id);
      }
      // Refresh refunds list
      const updatedRefunds = await PaymentService.getRefunds();
      setPayments((prev) => ({
        ...prev,
        refunds: updatedRefunds,
      }));
    } catch (error) {
      console.error("Error processing refund:", error);
    }
  };

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-6 w-20" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="max-w-md mx-auto pb-8">
      <header className="sticky top-0 bg-white z-10">
        <Tabs
          defaultValue="trips"
          className="w-full"
          onValueChange={(value) => {
            setActiveTab(value);
            if (value === "trips") {
              setActiveSection("past");
            } else if (value === "users") {
              setActiveSection("unverified");
            } else if (value === "payments") {
              setActiveSection("pendingPayments");
            } else if (value === "refunds") {
              setActiveSection("pending");
            }
          }}
        >
          <TabsList className="w-full grid grid-cols-4 h-12">
            <TabsTrigger
              value="trips"
              className={cn(
                "py-3 flex justify-center",
                activeTab === "trips" && "border-b-2 border-black"
              )}
            >
              Trips
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className={cn(
                "py-3 flex justify-center",
                activeTab === "users" && "border-b-2 border-black"
              )}
            >
              Users
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className={cn(
                "py-3 flex justify-center",
                activeTab === "payments" && "border-b-2 border-black"
              )}
            >
              Payments
            </TabsTrigger>
            <TabsTrigger
              value="refunds"
              className={cn(
                "py-3 flex justify-center",
                activeTab === "refunds" && "border-b-2 border-black"
              )}
            >
              Refunds
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {activeTab === "trips" && (
          <>
            <div className="grid grid-cols-3 border-b">
              <button
                className={cn(
                  "py-3 text-center font-medium",
                  activeSection === "past" && "border-b-2 border-black"
                )}
                onClick={() => setActiveSection("past")}
              >
                Past
              </button>
              <button
                className={cn(
                  "py-3 text-center font-medium",
                  activeSection === "live" && "border-b-2 border-black"
                )}
                onClick={() => setActiveSection("live")}
              >
                Live
              </button>
              <button
                className={cn(
                  "py-3 text-center font-medium",
                  activeSection === "upcoming" && "border-b-2 border-black"
                )}
                onClick={() => setActiveSection("upcoming")}
              >
                Upcoming
              </button>
            </div>
            <div className="flex flex-row items-center justify-center p-4">
              <button
                className="bg-orange-500 text-white px-4 py-2 rounded-md w-full hover:bg-white hover:text-gray-700 hover:border-[1px] hover:border-gray-300"
                onClick={() => {
                  setLoadingCreateFlagship(true);
                  router.push("/flagship/create");
                }}
                disabled={loadingCreateFlagship}
              >
                {loadingCreateFlagship
                  ? "Opening Create Flagship"
                  : "Create Flagship"}
              </button>
            </div>
          </>
        )}

        {activeTab === "users" && (
          <div className="grid grid-cols-3 border-b">
            <button
              className={cn(
                "py-3 text-center font-medium",
                activeSection === "unverified" && "border-b-2 border-black"
              )}
              onClick={() => setActiveSection("unverified")}
            >
              Unverified
            </button>
            <button
              className={cn(
                "py-3 text-center font-medium",
                activeSection === "pendingVerification" &&
                  "border-b-2 border-black"
              )}
              onClick={() => setActiveSection("pendingVerification")}
            >
              Pending Verification
            </button>
            <button
              className={cn(
                "py-3 text-center font-medium",
                activeSection === "verified" && "border-b-2 border-black"
              )}
              onClick={() => setActiveSection("verified")}
            >
              Verified
            </button>
          </div>
        )}

        {activeTab === "payments" && (
          <div className="grid grid-cols-2 border-b">
            <button
              className={cn(
                "py-3 text-center font-medium",
                activeSection === "pendingPayments" && "border-b-2 border-black"
              )}
              onClick={() => setActiveSection("pendingPayments")}
            >
              Pending Payments
            </button>
            <button
              className={cn(
                "py-3 text-center font-medium",
                activeSection === "completedPayments" &&
                  "border-b-2 border-black"
              )}
              onClick={() => setActiveSection("completedPayments")}
            >
              Approved Payments
            </button>
          </div>
        )}
      </header>

      <main className="p-4 space-y-6">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {activeTab === "trips" && (
              <TripsContainer
                trips={
                  activeSection === "past"
                    ? trips.past
                    : activeSection === "live"
                    ? trips.live
                    : trips.upcoming
                }
                activeSection={activeSection}
              />
            )}

            {activeTab === "users" && (
              <UsersContainer
                users={
                  activeSection === "unverified"
                    ? users.unverified
                    : activeSection === "pendingVerification"
                    ? users.pendingVerification
                    : users.verified
                }
                activeSection={activeSection}
              />
            )}

            {activeTab === "payments" && (
              <PaymentsContainer
                payments={
                  activeSection === "pendingPayments"
                    ? payments.pending
                    : payments.completed
                }
                activeSection={activeSection}
              />
            )}

            {activeTab === "refunds" && (
              <RefundsContainer
                refunds={payments.refunds}
                onRefundAction={handleRefundAction}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default withAuth(AdminMainPage, { allowedRoles: [ROLES.ADMIN] });
