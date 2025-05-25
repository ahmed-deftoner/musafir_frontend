const endpoints = {
  TOKEN_VERIFY: "user/verify-token",
  LOGOUT: "/user/logout",
  SIGNUP: "/user/register",
  CREATE_GOOGLE: "/user/create",
  VERIFY_EMAIL: "/user/verify-email",
  REQUEST_VERIFICATION: "/user/request-verification",
  FLAGSHIP: {
    FILTER: "/flagship",
    CREATE: "/flagship",
    UPDATE: "/flagship",
    GET: "/flagship/getByID",
    TRIP_QUERY: "/flagship/tripQuery",
  },
  REGISTRATION: {
    CREATE: "/registration",
    GET_PAST_PASSPORT: "/registration/pastPassport",
    GET_UPCOMING_PASSPORT: "/registration/upcomingPassport",
    SEND_RE_EVALUATE_REQUEST_TO_JURY: "/registration/reEvaluateRequestToJury",
  },
  FEEDBACK: {
    CREATE: "/feedback/:registrationId",
  },
  FAQ: {
    GET: "/faq/:flagshipId",
  },
  RATING: {
    GET: "/rating/:flagshipId",
    GET_TOP_FIVE: "/rating/top-five",
  },
  USER: {
    GET_ME: "/user/me",
  },
};
export default endpoints;
