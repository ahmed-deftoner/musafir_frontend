"use client";

import { useEffect, useState } from "react";
import { PaymentService } from "@/services/paymentService";
import { IPayment } from "@/services/types/payment";
import { FlagshipService } from "@/services/flagshipService";
import { IFlagship } from "@/services/types/flagship";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { IRegistration, IUser } from "@/interfaces/trip/trip";
import { useRouter } from "next/router";

export default function PaymentDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const paymentId = id as string;
  const { toast } = useToast();

  const [payment, setPayment] = useState<IPayment | null>(null);
  const [flagship, setFlagship] = useState<IFlagship | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await PaymentService.getPayment(paymentId);
        setPayment(data);
        setLoading(false);

        // Fetch flagship details if it's a string (ID)
        if (typeof (data.registration as IRegistration).flagship === "string") {
          const flagshipData = await FlagshipService.getFlagshipByID(
            (data.registration as IRegistration).flagship as string
          );
          setFlagship(flagshipData);
        } else {
          // If it's already an IFlagship object
          setFlagship(
            (data.registration as IRegistration).flagship as IFlagship
          );
        }
      } catch (error) {
        console.error("Error fetching payment details:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleApprovePayment = async () => {
    if (!paymentId) return;
    try {
      await PaymentService.approvePayment(paymentId);
      toast({
        title: "Success",
        description: "Payment approved successfully",
      });
      setTimeout(() => {
        router.push("/admin");
      }, 2000); // Wait 2 seconds before redirecting
    } catch (error) {
      console.error("Error approving payment:", error);
      toast({
        title: "Error",
        description: "Failed to approve payment",
        variant: "destructive",
      });
    }
  };

  const handleRejectPayment = async () => {
    if (!paymentId) return;
    try {
      await PaymentService.rejectPayment(paymentId);
      toast({
        title: "Success",
        description: "Payment rejected successfully",
      });
      setTimeout(() => {
        router.push("/admin");
      }, 2000); // Wait 2 seconds before redirecting
    } catch (error) {
      console.error("Error rejecting payment:", error);
      toast({
        title: "Error",
        description: "Failed to reject payment",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-4 space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-64 w-full" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    );
  }

  if (!payment) {
    return <div className="max-w-md mx-auto p-4">Payment not found</div>;
  }

  // Type guard to check if user is an IUser object
  const user =
    typeof (payment.registration as IRegistration).user === "string"
      ? null
      : ((payment.registration as IRegistration).user as IUser);
  // Type guard to check if bankAccount is an IBankAccount object
  const bankAccount =
    typeof payment.bankAccount === "string" ? null : payment.bankAccount;

  console.log(payment);
  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Payment Details</h1>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">User Information</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {user ? (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Name</span>
                  <span className="font-medium">{user.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone</span>
                  <span className="font-medium">{user.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">University</span>
                  <span className="font-medium">{user.university}</span>
                </div>
              </>
            ) : (
              <div className="text-gray-500">User details not available</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Payment Information</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Amount</span>
              <span className="font-medium">
                Rs. {payment.amount.toLocaleString()}
              </span>
            </div>
            {bankAccount ? (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bank</span>
                  <span className="font-medium">{bankAccount.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Number</span>
                  <span className="font-medium">
                    {bankAccount.accountNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">IBAN</span>
                  <span className="font-medium">{bankAccount.IBAN}</span>
                </div>
              </>
            ) : (
              <div className="text-gray-500">
                Bank account details not available
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Type</span>
              <span className="font-medium capitalize">
                {payment.paymentType}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date</span>
              <span className="font-medium">
                {new Date(payment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>
              <Badge
                variant="outline"
                className={cn(
                  "capitalize",
                  payment.status === "pending" && "text-yellow-600",
                  payment.status === "approved" && "text-green-600",
                  payment.status === "rejected" && "text-red-600"
                )}
              >
                {payment.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {flagship && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Trip Information</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Trip Name</span>
                <span className="font-medium">{flagship.tripName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Destination</span>
                <span className="font-medium">{flagship.destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dates</span>
                <span className="font-medium">
                  {new Date(flagship.startDate).toLocaleDateString()} -{" "}
                  {new Date(flagship.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">{flagship.days} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Base Price</span>
                <span className="font-medium">Rs. {flagship.basePrice}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Payment Screenshot</h2>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-video w-full">
            <Image
              src="/murree.webp"
              alt="Payment Screenshot"
              fill
              className="object-contain"
            />
          </div>
        </CardContent>
      </Card>

      {payment.status === "pendingApproval" && (
        <CardFooter className="flex justify-between gap-4">
          <Button
            variant="destructive"
            className="flex-1"
            onClick={handleRejectPayment}
          >
            Reject Payment
          </Button>
          <Button
            variant="default"
            className="flex-1"
            onClick={handleApprovePayment}
          >
            Approve Payment
          </Button>
        </CardFooter>
      )}
    </div>
  );
}
