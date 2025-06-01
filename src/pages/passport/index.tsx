import { useState, useEffect } from "react";
import { Navigation } from "../navigation";
import withAuth from "@/hoc/withAuth";
import PassportPastCard from "@/components/cards/PassportPastCard";
import PassportUpcomingCard from "@/components/cards/PassportUpcomingCard";
import useRegistrationHook from "@/hooks/useRegistrationHandler";
import { formatDate } from "@/utils/formatDate";

function Passport() {
  const [activeTab, setActiveTab] = useState<"past" | "upcoming">("past");
  const [pastEvents, setPastEvents] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const registrationHook = useRegistrationHook();

  const fetchPastPassport = async () => {
    try {
      const data = await registrationHook.getPastPassport();
      setPastEvents(data);
    } catch (error) {
      console.error("Error fetching past passport data:", error);
    }
  };

  const fetchUpcomingPassport = async () => {
    try {
      const data = await registrationHook.getUpcomingPassport();
      setUpcomingEvents(data);
    } catch (error) {
      console.error("Error fetching upcoming passport data:", error);
    }
  };

  useEffect(() => {
    fetchPastPassport();
    fetchUpcomingPassport();
  }, []);

  return (
    <div className='min-h-screen w-full bg-white md:flex md:items-center md:justify-center p-0'>
      <div className='bg-white w-full max-w-md mx-auto rounded-lg h-screen'>
        {/* Header */}
        <header className="p-4 flex justify-center">
          <h1 className="text-2xl font-bold">Passport</h1>
        </header>

        {/* Tabs */}
        <div className="border-b flex justify-between">
          <button
            className={`w-1/2 py-3 text-sm font-medium text-center ${
              activeTab === "past"
                ? "border-b-2 border-black text-black"
                : "text-gray-500 border-b-2 border-gray-300"
            }`}
            onClick={() => setActiveTab("past")}
          >
            Past
          </button>
          <button
            className={`w-1/2 py-3 text-sm font-medium text-center ${
              activeTab === "upcoming"
                ? "border-b-2 border-black text-black"
                : "text-gray-500 border-b-2 border-gray-300"
            }`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming
          </button>
        </div>

        {/* Main Content */}
        <main className="space-y-4 p-4 pb-24">
          {activeTab === "past" && pastEvents.length > 0
            ? pastEvents.map((event) => (
                <PassportPastCard
                  key={event._id}
                  registrationId={event._id}
                  title={event.flagshipId.tripName}
                  date={formatDate(
                    event.flagshipId.startDate,
                    event.flagshipId.endDate
                  )}
                  location={event.flagshipId.destination}
                  rating={event.ratingId?.rating}
                  price={event.price}
                  status={event.status}
                />
              ))
            : activeTab === "past" && (
                <div className="flex flex-col items-center justify-center h-60 text-gray-400">
                  <p className="text-center text-lg mb-2">
                    You haven't been on any trips yet.
                  </p>
                  <p className="text-center">
                    Time for an adventure - book your first trip now!
                  </p>
                </div>
              )}
          {activeTab === "upcoming" && upcomingEvents.length > 0
            ? upcomingEvents.map((event) => (
                <PassportUpcomingCard
                  key={event._id}
                  registrationId={event._id}
                  title={event.flagship.tripName}
                  date={formatDate(
                    event.flagship.startDate,
                    event.flagship.endDate
                  )}
                  appliedDate={new Date(event.createdAt).toLocaleDateString()}
                  location={event.flagship.destination}
                  image={event.flagship.images[0]}
                  status={event.status}
                  paymentInfo={{
                    amount: event.price,
                    dueAmount: event.amountDue,
                  }}
                  detailedPlan={event?.flagship?.detailedPlan}
                />
              ))
            : activeTab === "upcoming" && (
                <div className="flex flex-col items-center justify-center h-60 text-gray-400">
                  <p className="text-center text-lg mb-2">
                    No upcoming trips scheduled!
                  </p>
                  <p className="text-center">
                    Explore our trips and plan your next adventure.
                  </p>
                </div>
              )}
        </main>

        {/* Navigation */}
        <Navigation />
      </div>
    </div>
  );
}

export default withAuth(Passport);
