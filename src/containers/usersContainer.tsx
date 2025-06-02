import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IUser } from "@/services/types/user";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface UsersContainerProps {
  users: IUser[];
  activeSection: string;
}

export function UsersContainer({ users, activeSection }: UsersContainerProps) {
  const router = useRouter();

  const handleViewUserDetails = (userId: string) => {
    router.push(`/admin/user/${userId}`);
  };

  return (
    <div className="space-y-6">
      {users.map((user) => (
        <Card
          key={user._id}
          className="overflow-hidden transition-all duration-200 hover:shadow-lg"
        >
          <CardHeader className="pb-2">
            <h3 className="text-lg font-semibold">{user.fullName}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Phone</span>
                <span className="font-medium">{user.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">University</span>
                <span className="font-medium">{user.university}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewUserDetails(user._id)}
            >
              View Details
            </Button>
            <Badge
              variant="outline"
              className={cn(
                "capitalize",
                user.verification.status === "unverified" && "text-red-600",
                user.verification.status === "pending" && "text-yellow-600",
                user.verification.status === "verified" && "text-green-600"
              )}
            >
              {user.verification.status}
            </Badge>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
