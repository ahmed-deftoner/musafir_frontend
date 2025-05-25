import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { IFlagship } from "@/services/types/flagship";
import { useRouter } from "next/navigation";

interface TripsContainerProps {
  trips: IFlagship[];
  activeSection: string;
}

export function TripsContainer({ trips, activeSection }: TripsContainerProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleViewTripDetails = (tripId: string) => {
    router.push(`/admin/trip/${tripId}`);
  };

  return (
    <div className="space-y-6">
      {trips.map((trip) => (
        <Card
          key={trip._id}
          className="overflow-hidden transition-all duration-200 hover:shadow-lg"
        >
          <div className="relative h-48">
            <Image
              src={trip.images[0]}
              alt={trip.tripName}
              fill
              className="object-cover"
            />
          </div>
          <CardHeader className="pb-2">
            <h3 className="text-lg font-semibold">{trip.tripName}</h3>
            <p className="text-sm text-gray-500">
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{trip.destination}</span>
              <span className="font-medium">{trip.totalSeats} seats</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewTripDetails(trip._id)}
            >
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
