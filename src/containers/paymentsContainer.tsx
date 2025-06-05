import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IBankAccount, IPayment, IRefund } from "@/services/types/payment";
import { IUser } from "@/services/types/user";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRouter } from "next/navigation";
import { IRegistration } from "@/interfaces/trip/trip";

interface PaymentsContainerProps {
  payments: IPayment[] | IRefund[];
  activeSection: string;
  onRefundAction?: (id: string, action: "approve" | "reject") => void;
}

export function PaymentsContainer({
  payments,
  activeSection,
  onRefundAction,
}: PaymentsContainerProps) {
  const router = useRouter();
  const isRefund = (item: IPayment | IRefund): item is IRefund => {
    return "reason" in item;
  };

  const handleViewDetails = (paymentId: string) => {
    router.push(`/admin/payment/${paymentId}`);
  };

  return (
    <div className="space-y-6">
      {payments?.length > 0 ? payments.map((item) => (
        <Card
          key={item._id}
          className="overflow-hidden transition-all duration-200 hover:shadow-lg"
        >
          <CardHeader className="pb-2">
            <h3 className="text-lg font-semibold">
              {isRefund(item)
                ? ((item.registration as IRegistration).user as IUser).fullName
                : ((item.registration as IRegistration).user as IUser).fullName}
            </h3>
            <p className="text-sm text-gray-500">
              {new Date(item.createdAt).toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent>
            {isRefund(item) ? (
              <>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Amount</span>
                    <span className="font-medium">
                      Rs.{" "}
                      {(
                        (item.registration as IRegistration)
                          .payment as unknown as IPayment
                      ).amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Date</span>
                    <span className="font-medium">
                      {new Date(
                        (
                          (item.registration as IRegistration)
                            .payment as unknown as IPayment
                        ).createdAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Accordion type="single" collapsible className="mt-4">
                  <AccordionItem value="details">
                    <AccordionTrigger className="text-sm">
                      Details
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rating</span>
                          <span className="font-medium">{item.rating}/5</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Reason</span>
                          <span className="font-medium">{item.reason}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bank Details</span>
                          <span className="font-medium">
                            {item.bankDetails}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Feedback</span>
                          <span className="font-medium">{item.feedback}</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-medium">
                    Rs. {item.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bank</span>
                  <span className="font-medium">
                    {(item?.bankAccount as IBankAccount)?.bankName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type</span>
                  <span className="font-medium capitalize">
                    {item.paymentType}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {isRefund(item) && onRefundAction ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600"
                  onClick={() => onRefundAction(item._id, "approve")}
                >
                  Clear
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600"
                  onClick={() => onRefundAction(item._id, "reject")}
                >
                  Reject
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "capitalize",
                    item.status === "pending" && "text-yellow-600",
                    item.status === "approved" && "text-green-600",
                    item.status === "rejected" && "text-red-600"
                  )}
                >
                  {item.status}
                </Badge>
                {item.status === "pendingApproval" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(item._id)}
                  >
                    View Details
                  </Button>
                )}
              </div>
            )}
          </CardFooter>
        </Card>
      )) : (
        <div className="text-center text-gray-500 py-8">
          <p className="text-xl font-medium mb-2">No Payments Available Yet</p>
        </div>
      )}
    </div>
  );
}
