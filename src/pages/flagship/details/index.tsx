import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import Image from "next/image";
import { flagshipState } from "@/recoil/flagshipState";
import useFlagshipHook from "@/hooks/useFlagshipHandler";
import { IoLocationOutline } from "react-icons/io5";
import {
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
  HiChevronDown,
} from "react-icons/hi";
import ReviewCard from "@/components/cards/ReviewCard";
import { formatDate } from "@/utils/formatDate";
import Navigation from "../../navigation";
import { showAlert } from "@/pages/alert";
import useFaqHook from "@/hooks/useFaqHandler";
import useRatingHook from "@/hooks/useRatingHandler";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function FlagshipDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { getFaq } = useFaqHook();
  const { getTopFiveRating } = useRatingHook();
  const { getFlagship, sendTripQuery } = useFlagshipHook();

  const [flagship, setFlagship] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [showQueryInput, setShowQueryInput] = useState(false);
  const [queryText, setQueryText] = useState("");
  const [faq, setFaq] = useState<any>([]);
  const [rating, setRating] = useState<any>([]);
  const existingFlagship = useRecoilValue(flagshipState);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);

  const fetchFaq = async () => {
    const faq = await getFaq();
    setFaq(faq);
  };

  const fetchRating = async () => {
    if (!id) return;
    const rating = await getTopFiveRating(id as string);
    setRating(rating);
  };

  const fetchFlagshipDetails = async () => {
    if (!id) return;
    try {
      if (existingFlagship && existingFlagship.id === id) {
        setFlagship(existingFlagship);
      } else {
        const data = await getFlagship(id as string);
        setFlagship(data);
      }
    } catch (err) {
      console.error("Error fetching flagship details:", err);
    }
  };

  const calculateTimeLeft = () => {
    const deadline = new Date(flagship.endDate);
    const now = new Date();
    const difference = deadline.getTime() - now.getTime();
    if (difference > 0) {
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    }
  };

  useEffect(() => {
    fetchFlagshipDetails();
    fetchFaq();
    fetchRating();
  }, [id, existingFlagship]);

  useEffect(() => {
    if (!flagship) return;
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [flagship]);

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const scrollPosition = window.scrollY;
        const triggerPosition = contentRef.current.offsetTop + 200;
        setIsButtonVisible(scrollPosition > triggerPosition);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!flagship) {
    return null;
  }

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const handleSubmitQuery = async () => {
    if (queryText.trim() === "") {
      setShowQueryInput(!showQueryInput);
      return;
    } else {
      const res = await sendTripQuery(queryText, id as string);
      if (res.statusCode === 200) {
        setQueryText("");
        showAlert("Trip query sent successfully", "success");
        setShowQueryInput(false);
      } else {
        showAlert("Failed to send trip query", "error");
      }
    }
  };
  const defaultImage = "/flowerFields.jpg";
  const imageUrls =
    flagship.images && flagship.images.length > 0
      ? flagship.images
      : [defaultImage];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? imageUrls.length - 1 : prev - 1
    );
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen pb-8 relative">
      {/* Sticky Register Button */}
      {isButtonVisible && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white max-w-md mx-auto">
          <div className="p-1">
            <button
              onClick={() => router.push(`/flagship/flagship-requirement?id=${id}&fromDetailsPage=true`)}
              className="w-full py-3 bg-orange-500 text-[#2B2D42] font-semibold rounded-md"
            >
              Register
            </button>
          </div>
        </div>
      )}

      {/* Header with back button and title */}
      <div className="px-4 py-3 flex items-center relative">
        <button
          onClick={() => router.back()}
          className="absolute left-4 flex items-center text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <h1 className="text-xl font-bold w-full text-center">
          {flagship.tripName}
        </h1>
      </div>

      {/* Hero Image */}
      <div className="relative h-52 w-full">
        <Image
          src={imageUrls[currentImageIndex]}
          alt={flagship.tripName || "Event image"}
          fill
          className="object-cover"
        />

        {imageUrls.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1 hover:bg-white/90 transition-colors z-10"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1 hover:bg-white/90 transition-colors z-10"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>

            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
              {imageUrls.map((_: string, index: number) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    currentImageIndex === index
                      ? "w-4 bg-white"
                      : "w-1.5 bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Trip Info */}
      <div className="px-4 py-4 pb-10" ref={contentRef}>
        <h2 className="text-2xl font-bold mb-4">{flagship.tripName}</h2>
        <div className="space-y-3 mb-5">
          <div className="flex items-center">
            <IoLocationOutline className="w-5 h-5 text-gray-500 mr-2" />
            <span>{flagship.destination}</span>
          </div>

          <div className="flex items-center">
            <HiOutlineCalendar className="w-5 h-5 text-gray-500 mr-2" />
            <span>{formatDate(flagship.startDate, flagship.endDate)}</span>
          </div>

          <div className="flex items-center">
            <HiOutlineCurrencyDollar className="w-5 h-5 text-gray-500 mr-2" />
            <span>Starts Rs.{flagship.basePrice}</span>
          </div>
        </div>

        {/* Register Button */}
        <button
          onClick={() => router.push(`/flagship/flagship-requirement?id=${id}&fromDetailsPage=true`)}
          className="w-full py-3 bg-orange-500 text-[#2B2D42] font-semibold rounded-md mb-3"
        >
          Register
        </button>

        {/* View Detailed Plan Button */}
        <button
          onClick={() => setShowPdfModal(true)}
          className="w-full py-3 bg-gray-200 text-gray-800 font-semibold rounded-md"
        >
          View Detailed Travel Plans
        </button>

        {/* Countdown Timer */}
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Time left to register</h3>
          <div className="flex justify-center gap-x-4">
            <div className="flex flex-col items-center">
              <div className="bg-black text-white w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold">
                {timeLeft.days}
              </div>
              <span className="text-sm mt-1">Days</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-white text-black w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold border border-black">
                {timeLeft.hours}
              </div>
              <span className="text-sm mt-1">Hrs</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-white text-black w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold border border-black">
                {timeLeft.minutes}
              </div>
              <span className="text-sm mt-1">Min</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-white text-black w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold border border-black">
                {timeLeft.seconds}
              </div>
              <span className="text-sm mt-1">Sec</span>
            </div>
          </div>
        </div>

        {/* Past Reviews */}
        {rating.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Past Reviews</h3>
            <div
              className="flex overflow-x-auto space-x-4"
              style={{
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {rating.map((review: any, index: number) => (
                <div key={index} className="flex-shrink-0 w-72">
                  <ReviewCard
                    name={review?.userId?.fullName}
                    location={review?.flagshipId?.destination}
                    rating={review?.rating}
                    eventName={review?.flagshipId?.tripName}
                    comment={review?.review}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Starting Prices */}
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-3">Starting prices</h3>
          <div className="overflow-hidden">
            {flagship.locations &&
              flagship.locations.map(
                (
                  location: { name: string; price: string; enabled: boolean },
                  index: number
                ) =>
                  location.enabled && (
                    <div
                      key={index}
                      className="bg-red-100 px-4 py-3 flex justify-between mb-[3px]"
                    >
                      <span className="font-medium">From {location.name}</span>
                      <span className="font-medium">
                        {parseInt(location.price).toLocaleString()}
                      </span>
                    </div>
                  )
              )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-6">
          {faq.length > 0 && (
            <>
              <h3 className="text-lg font-bold mb-3">
                Frequently Asked Questions
              </h3>
              <div className="space-y-2">
                {faq.map((faq: any, index: number) => (
                  <div key={index} className="border-b border-gray-200">
                    <button
                      className="w-full py-4 px-2 flex justify-between items-center text-left"
                      onClick={() => toggleFAQ(index)}
                    >
                      <span className="font-medium">{faq.question}</span>
                      <HiChevronDown
                        className={`w-5 h-5 transition-transform ${
                          expandedFAQ === index ? "transform rotate-180" : ""
                        }`}
                      />
                    </button>
                    {expandedFAQ === index && (
                      <div className="px-2 pb-4 text-gray-600">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Ask a Question */}
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2">
              Still have a question? Ask away
            </h3>
            {showQueryInput && (
              <div className="my-3">
                <div className="flex">
                  <input
                    type="text"
                    value={queryText}
                    onChange={(e) => setQueryText(e.target.value)}
                    placeholder="Enter your question here..."
                    className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            )}
            <button
              onClick={() => handleSubmitQuery()}
              className={`w-full py-3 border-2 text-black font-semibold rounded-lg ${queryText.length > 0 ? "bg-orange-500 text-[#2B2D42]" : "border-black"}`}
            >
              {queryText.length > 0 ? "Send Trip Query" : "Trip Query Button"}
            </button>
          </div>
        </div>
      </div>

      {/* PDF Modal */}
      {showPdfModal && flagship?.detailedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-2 border-b">
              <h3 className="text-md font-semibold">Detailed Travel Plan</h3>
              <button
                onClick={() => setShowPdfModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                src={flagship.detailedPlan}
                className="w-full h-full"
                title="Detailed Travel Plan"
              />
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <Navigation />
    </div>
  );
}
