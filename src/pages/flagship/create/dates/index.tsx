import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useFlagshipHook from '@/hooks/useFlagshipHandler';
import { Flagship } from '@/interfaces/flagship';
import { currentFlagship } from '@/store';
import { useRecoilValue } from 'recoil';
import { HttpStatusCode } from 'axios';
import { showAlert } from '@/pages/alert';
import { ROLES, ROUTES_CONSTANTS, steps } from '@/config/constants';
import dayjs from 'dayjs';
import withAuth from '@/hoc/withAuth';
import ProgressBar from '@/components/progressBar';

function ImportantDates() {
  const activeStep = 4;
  const router = useRouter();
  const action = useFlagshipHook();
  const flagshipData: Flagship = useRecoilValue(currentFlagship);
  // Date states
  const [tripDates, setTripDates] = useState('');
  const [registrationDeadline, setRegistrationDeadline] = useState('');
  const [advancePaymentDeadline, setAdvancePaymentDeadline] = useState('');
  const [earlyBirdDeadline, setEarlyBirdDeadline] = useState('');

  interface FormErrors {
    tripDates: string;
    registrationDeadline: string;
    advancePaymentDeadline: string;
    earlyBirdDeadline: string;
  }

  const [errors, setErrors] = useState<FormErrors>({
    tripDates: '',
    registrationDeadline: '',
    advancePaymentDeadline: '',
    earlyBirdDeadline: '',
  });

  useEffect(() => {
    if (!flagshipData._id || !flagshipData.startDate) {
      showAlert('Create a Flagship', 'error');
      router.push(ROUTES_CONSTANTS.FLAGSHIP.CREATE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (flagshipData) {
      // For tripDates (stored as a string)
      setTripDates(flagshipData.tripDates || '');

      // For dates, convert them to ISO string format (or any desired format) if available
      setRegistrationDeadline(
        flagshipData.registrationDeadline
          ? new Date(flagshipData.registrationDeadline).toISOString().slice(0, 10)
          : ''
      );
      setAdvancePaymentDeadline(
        flagshipData.advancePaymentDeadline
          ? new Date(flagshipData.advancePaymentDeadline).toISOString().slice(0, 10)
          : ''
      );
      setEarlyBirdDeadline(
        flagshipData.earlyBirdDeadline
          ? new Date(flagshipData.earlyBirdDeadline).toISOString().slice(0, 10)
          : ''
      );
    }
  }, [flagshipData]);

  // Extract and format trip dates when flagshipData changes
  useEffect(() => {
    if (flagshipData.startDate && flagshipData.endDate) {
      const start = dayjs(flagshipData.startDate);
      const end = dayjs(flagshipData.endDate);
      // Example format: "23 Feb - 25 Feb"
      setTripDates(`${start.format('DD MMM')} - ${end.format('DD MMM')}`);
    }
  }, [flagshipData.startDate, flagshipData.endDate]);

  const validateDeadline = (deadline: string, fieldName: string): string => {
    if (!deadline.trim()) {
      return `${fieldName} is required`;
    }
    const deadlineDate = dayjs(deadline);
    const startDate = dayjs(flagshipData.startDate);
    if (!deadlineDate.isBefore(startDate)) {
      return `${fieldName} must be before the flagship start date`;
    }
    return '';
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      tripDates: '',
      registrationDeadline: '',
      advancePaymentDeadline: '',
      earlyBirdDeadline: '',
    };

    if (!tripDates.trim()) {
      newErrors.tripDates = 'Trip Dates are required';
    }
    newErrors.registrationDeadline = validateDeadline(
      registrationDeadline,
      'Registration Deadline'
    );
    newErrors.advancePaymentDeadline = validateDeadline(
      advancePaymentDeadline,
      'Advance Payment Deadline'
    );
    newErrors.earlyBirdDeadline = validateDeadline(earlyBirdDeadline, 'Early Bird Deadline');

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === '');
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;
    const formData = {
      tripDates,
      registrationDeadline: new Date(registrationDeadline),
      advancePaymentDeadline: new Date(advancePaymentDeadline),
      earlyBirdDeadline: new Date(earlyBirdDeadline),
    };

    try {
      const flagshipId = flagshipData._id || '';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await action.update(flagshipId, formData);
      if (res.statusCode === HttpStatusCode.Ok) {
        showAlert('Dates Added!', 'success');
        router.push(ROUTES_CONSTANTS.FLAGSHIP.DISCOUNTS);
      }
    } catch (error) {
      console.error('Network error', error);
    }
  };

  return (
    <div className='min-h-screen w-full bg-gray-50 md:flex md:items-center md:justify-center p-0'>
      <div className='bg-white w-full max-w-md mx-auto rounded-lg shadow-sm h-screen p-3 w-full'>
        {/* Title */}
        <div className='text-center py-4'>
          <h1 className='text-2xl font-bold'>Create a Flagship</h1>
        </div>

        {/* Progress bar */}
        <ProgressBar steps={steps} activeStep={activeStep} />

        {/* Main Content */}
        <div className='px-4 pb-20'>
          <h2 className='text-3xl font-bold mb-6'>5: Imp Dates</h2>

          {/* Trip Dates */}
          <div className='mb-8'>
            <h3 className='text-xl font-bold mb-3'>Trip Dates</h3>
            <div className='bg-gray-100 rounded-xl p-4'>
              <input
                type='text'
                value={tripDates}
                onChange={(e) => setTripDates(e.target.value)}
                className='w-full bg-transparent focus:outline-none text-lg'
                placeholder='23-24th Feb'
                disabled
              />
            </div>
            {errors.tripDates && <p className='text-red-500 text-sm'>{errors.tripDates}</p>}
          </div>

          {/* Registration Deadline */}
          <div className='mb-8'>
            <h3 className='text-xl font-bold mb-3'>Registration Deadline</h3>
            <div className='flex gap-2'>
              <div className='flex-1'>
                <div>
                  <input
                    type='date'
                    value={registrationDeadline}
                    onChange={(e) => setRegistrationDeadline(e.target.value)}
                    className='w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none text-lg'
                    placeholder='MM/DD/YYYY'
                  />
                </div>
                {errors.registrationDeadline && (
                  <p className='text-red-500 text-sm'>{errors.registrationDeadline}</p>
                )}
              </div>
            </div>
          </div>

          {/* Advance Payment Deadline */}
          <div className='mb-8'>
            <h3 className='text-xl font-bold mb-3'>Advance Payment Deadline</h3>
            <div className='flex gap-2'>
              <div className='flex-1'>
                <div>
                  <input
                    type='date'
                    value={advancePaymentDeadline}
                    onChange={(e) => setAdvancePaymentDeadline(e.target.value)}
                    className='w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none text-lg'
                    placeholder='MM/DD/YYYY'
                  />
                </div>
                {errors.advancePaymentDeadline && (
                  <p className='text-red-500 text-sm'>{errors.advancePaymentDeadline}</p>
                )}
              </div>
            </div>
          </div>

          {/* Early Bird Deadline */}
          <div className='mb-8'>
            <h3 className='text-xl font-bold mb-3'>Early Bird Deadline</h3>
            <div className='flex gap-2'>
              <div className='flex-1'>
                <input
                  type='date'
                  value={earlyBirdDeadline}
                  onChange={(e) => setEarlyBirdDeadline(e.target.value)}
                  className='w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none text-lg'
                  placeholder='MM/DD/YYYY'
                />
              </div>
            </div>
            {errors.earlyBirdDeadline && (
              <p className='text-red-500 text-sm'>{errors.earlyBirdDeadline}</p>
            )}
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={handleSubmit}
          className='w-full bg-orange-500 text-black py-4 rounded-xl font-bold text-lg'
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default withAuth(ImportantDates, { allowedRoles: [ROLES.ADMIN] });
