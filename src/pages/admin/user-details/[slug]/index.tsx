"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Phone, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FlagshipService } from "@/services/flagshipService";
import { useRouter } from "next/router";
import { IRegistration } from "@/interfaces/trip/trip";
import { differenceInYears, parseISO } from "date-fns";
import { toast } from "sonner";

export default function UserDetails() {
  const [expandedSections, setExpandedSections] = useState({
    contact: true,
    info: false,
    verification: true,
  });

  const [registeredUser, setRegisteredUser] = useState<IRegistration>();
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"approve" | "reject" | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const openModal = (type: "approve" | "reject") => {
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setComment("");
    setModalType(null);
  };

  const handleSubmit = async () => {
    if (!slug) return;

    setSubmitting(true);
    try {
      if (modalType === "approve") {
        await FlagshipService.approveRegistration(slug as string, comment);
        alert("Registration Approved Successfully");
        await fetchUsers();
      } else if (modalType === "reject") {
        await FlagshipService.rejectRegistration(slug as string, comment);
        alert("Registration Rejected");
        router.push(`/trip/${registeredUser?.flagship}`);
      }
      closeModal();
    } catch (error) {
      console.error(`Error ${modalType}ing registration:`, error);
      toast.error(`Failed to ${modalType} registration`);
    } finally {
      setSubmitting(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await FlagshipService.getRegistrationByID(
        slug as string
      );
      setRegisteredUser(response);
    } catch (error) {
      console.error("Failed to fetch registered users:", error);
      toast.error("Failed to load user details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchUsers();
    }
  }, [slug]);

  if (loading) {
    return <p className="p-4">Loading...</p>;
  }

  return (
    <div className="max-w-md mx-auto pb-8 bg-white">
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500"
              disabled={submitting}
            >
              <X />
            </button>
            <h2 className="text-lg font-bold mb-4 capitalize">
              {modalType} User
            </h2>
            <textarea
              placeholder="Optional Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 mb-4 resize-none"
              rows={4}
              disabled={submitting}
            />
            <button
              onClick={handleSubmit}
              className={`w-full text-white py-2 rounded-lg ${
                modalType === "approve"
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-red-800 hover:bg-red-900"
              } ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={submitting}
            >
              {submitting
                ? `${modalType === "approve" ? "Approving..." : "Rejecting..."}`
                : `Confirm ${
                    modalType === "approve" ? "Approval" : "Rejection"
                  }`}
            </button>
          </div>
        </div>
      )}

      <header className="sticky top-0 bg-white z-10">
        <div className="p-4 border-b flex items-center">
          <Link
            href={`/admin/trip/${registeredUser?.flagship}`}
            className="mr-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-left"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold flex-1 text-center">User Details</h1>
        </div>
      </header>

      <div className="p-4 flex items-center">
        <div className="h-16 w-16 mr-4 overflow-hidden rounded-full bg-gray-200">
          <img
            src={registeredUser?.user.profileImg}
            alt="Ali Rehan"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">
            {registeredUser?.user.fullName}
          </h2>
          <p className="text-sm text-gray-500">
            Joining From: {registeredUser?.user.city}
          </p>
        </div>
        <div className="relative">
          <Image
            src="/blue-shield.png"
            alt="Verified Shield"
            width={40}
            height={40}
          />
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="px-4 py-2">
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <button
            onClick={() => toggleSection("contact")}
            className="flex justify-between items-center w-full"
          >
            <h3 className="font-bold">Contact Information</h3>
            {expandedSections.contact ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>

          {expandedSections.contact && (
            <div className="mt-4 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-medium">
                  {registeredUser?.user.email}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Phone</span>
                <span className="font-medium">
                  {registeredUser?.user.phone}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Social Link</span>
                <span className="font-medium">
                  {registeredUser?.user.socialLink}
                </span>
              </div>

              <div className="flex gap-4 mt-4">
                <button className="flex-1 border border-gray-300 rounded-lg py-2 px-4 flex items-center justify-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                    <Phone className="h-3 w-3 text-white" />
                  </div>
                  <span>Cell Phone</span>
                </button>

                <button className="flex-1 bg-black text-white rounded-lg py-2 px-4 flex items-center justify-center gap-2">
                  <Image
                    src="/whatsapp.png"
                    alt="Verified Shield"
                    width={20}
                    height={20}
                  />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info/Details Section */}
      <div className="px-4 py-2">
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <button
            className="flex justify-between items-center w-full"
            onClick={() => toggleSection("info")}
          >
            <h3 className="font-bold">Info/ Details</h3>
            {expandedSections.info ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>

          {expandedSections.info && (
            <div className="mt-4 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Name</span>
                <span className="font-medium">
                  {registeredUser?.user.fullName}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Gender</span>
                <span className="font-medium">
                  {registeredUser?.user.gender}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Age</span>
                <span className="font-medium">
                  {" "}
                  {registeredUser?.user.dateOfBirth
                    ? differenceInYears(
                        new Date(),
                        parseISO(registeredUser.user.dateOfBirth)
                      )
                    : "N/A"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">University</span>
                <span className="font-medium">
                  {registeredUser?.user.university}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Verification Methods Section */}
      <div className="px-4 py-2">
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <button
            className="flex justify-between items-center w-full"
            onClick={() => toggleSection("verification")}
          >
            <h3 className="font-bold">Verification Methods</h3>
            {expandedSections.verification ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>

          {expandedSections.verification && (
            <div className="mt-4 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Verification Choice</span>
                <span className="font-medium">2 Referral</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Verification Date</span>
                <span className="font-medium">Dec 10, 2024</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <button className="border border-gray-300 rounded-lg py-3 px-4 font-medium">
                  Didn't Pick
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal("reject");
                  }}
                  className="bg-red-800 text-white rounded-lg py-3 px-4 font-medium"
                >
                  Reject
                </button>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openModal("approve");
                }}
                className="w-full bg-orange-500 text-white rounded-lg py-3 px-4 font-medium"
              >
                Approve
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
