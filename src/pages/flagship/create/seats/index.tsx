'use client';

import { useState, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useFlagshipHook from '@/hooks/useFlagshipHandler';
import { currentFlagship } from '@/store';
import { useRecoilValue } from 'recoil';
import { HttpStatusCode } from 'axios';
import { showAlert } from '@/pages/alert';
import { ROLES, ROUTES_CONSTANTS, steps } from '@/config/constants';
import { Flagship } from '@/interfaces/flagship';
import withAuth from '@/hoc/withAuth';
import ProgressBar from '@/components/progressBar';

function SeatsAllocation() {
  const activeStep = 3;
  const router = useRouter();
  const action = useFlagshipHook();
  const flagshipData: Flagship = useRecoilValue(currentFlagship);
  const flagshipLocations = flagshipData.locations || [];
  // Total capacity state
  const [totalSeats, setTotalSeats] = useState('');

  // Gender split state
  const [genderSplit, setGenderSplit] = useState(50);
  const [femaleSeats, setFemaleSeats] = useState('');
  const [maleSeats, setMaleSeats] = useState('');

  // Mattress-Bed split state
  const [bedMattressSplit, setBedMattressSplit] = useState(50);
  const [bedSeats, setBedSeats] = useState('');
  const [mattressSeats, setMattressSeats] = useState('');
  // Mounted state to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);

  // City split state
  const [citySeats, setCitySeats] = useState<{ [key: string]: number }>({});

  // Error state for validations
  const [errors, setErrors] = useState<{
    totalSeats: string;
    citySeats: { [key: string]: string };
  }>({ totalSeats: '', citySeats: {} });

  // When locations change, update citySeats for enabled locations
  useEffect(() => {
    setMounted(true);
    if (!flagshipData._id || !flagshipData.tripName) {
      showAlert('Create a Flagship', 'error');
      router.push(ROUTES_CONSTANTS.FLAGSHIP.CREATE);
    }
    if (flagshipData?.locations?.length === 0) {
      showAlert('Fill Pricing Data First', 'error');
      router.push(ROUTES_CONSTANTS.FLAGSHIP.PRICING);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect to update state on page load if flagshipData is available
  useEffect(() => {
    if (flagshipData) {
      // For discounts, basePrice, citySeats, gender splits, etc.
      if (flagshipData?.maleSeats && flagshipData?.femaleSeats) {
        const male = Number(flagshipData.maleSeats);
        const female = Number(flagshipData.femaleSeats);
        const total = male + female;
        if (total > 0) {
          const initialGenderSplit = Math.round((female / total) * 100);
          setGenderSplit(initialGenderSplit);
        }
      }

      if (flagshipData?.bedSeats && flagshipData?.mattressSeats) {
        const bed = Number(flagshipData.bedSeats);
        const mattress = Number(flagshipData.mattressSeats);
        const total = bed + mattress;
        if (total > 0) {
          const initialBedSplit = Math.round((bed / total) * 100);
          setBedMattressSplit(initialBedSplit);
        }
      }

      if (flagshipData.totalSeats) setTotalSeats(String(flagshipData.totalSeats));
      if (flagshipData.citySeats) setCitySeats(flagshipData.citySeats as { [key: string]: number });
      if (flagshipData.maleSeats) setMaleSeats(String(flagshipData.maleSeats));
      if (flagshipData.femaleSeats) setFemaleSeats(String(flagshipData.femaleSeats));
      if (flagshipData.bedSeats) setBedSeats(String(flagshipData.bedSeats));
      if (flagshipData.mattressSeats) setMattressSeats(String(flagshipData.mattressSeats));
    }
  }, [flagshipData]);

  // Update gender seats when total or split changes
  useEffect(() => {
    const total = Number.parseInt(totalSeats) || 0;
    setFemaleSeats(Math.round((genderSplit / 100) * total).toString());
    setMaleSeats(Math.round(((100 - genderSplit) / 100) * total).toString());
  }, [totalSeats, genderSplit]);

  // Update bed/mattress seats when total or split changes
  useEffect(() => {
    const total = Number.parseInt(totalSeats) || 0;
    setBedSeats(Math.round((bedMattressSplit / 100) * total).toString());
    setMattressSeats(Math.round(((100 - bedMattressSplit) / 100) * total).toString());
  }, [totalSeats, bedMattressSplit]);

  // Handle city seat changes
  const updateCitySeats = (city: keyof typeof citySeats, increment: boolean) => {
    const currentValue = citySeats[city] || 0;
    const newValue = increment ? currentValue + 1 : currentValue - 1;
    if (newValue >= 0) {
      setCitySeats({
        ...citySeats,
        [city]: newValue,
      });
    }
  };

  // Validate fields before submitting
  const validateFields = (): boolean => {
    let isValid = true;
    const newErrors: {
      totalSeats: string;
      citySeats: { [key: string]: string };
    } = {
      totalSeats: '',
      citySeats: {},
    };

    if (!totalSeats.trim()) {
      newErrors.totalSeats = 'Total capacity is required';
      isValid = false;
    }

    let totalCitySeats = 0;
    console.log(citySeats);

    for (const city in citySeats) {
      const value = citySeats[city];
      if (value === undefined || value === null || isNaN(Number(value))) {
        newErrors.citySeats[city] = `${city} seats is required and must be a number`;
        isValid = false;
      } else {
        totalCitySeats += Number(value);
      }
    }

    if (isValid) {
      const total = Number(totalSeats);
      if (totalCitySeats !== total) {
        newErrors.citySeats['global'] = 'Sum of all city seats should be equal to total seats';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateFields()) return;

    const formData = {
      totalSeats: Number(totalSeats),
      femaleSeats: Number(femaleSeats),
      maleSeats: Number(maleSeats),
      citySeats: citySeats,
      bedSeats: Number(bedSeats),
      mattressSeats: Number(mattressSeats),
    };

    try {
      const flagshipId = flagshipData._id || '';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await action.update(flagshipId, formData);
      if (res.statusCode === HttpStatusCode.Ok) {
        showAlert('Seats info Added!', 'success');
        router.push(ROUTES_CONSTANTS.FLAGSHIP.IMP_DATES);
      }
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  if (!mounted) return null; // avoid hydration issues

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
          <h2 className='text-3xl font-bold mb-6'>4: Seats Allocation</h2>

          {/* Total Capacity */}
          <div className='mb-8'>
            <h3 className='text-xl font-bold mb-3'>Total Capacity</h3>
            <div className='border-2 border-black rounded-xl overflow-hidden'>
              <input
                value={totalSeats}
                min={0}
                onChange={(e) => setTotalSeats(e.target.value)}
                className='w-full px-4 py-3 focus:outline-none text-lg'
                placeholder='Enter total seats'
              />
            </div>
            {errors.totalSeats && <p className='text-red-500 text-sm mt-1'>{errors.totalSeats}</p>}
          </div>

          {/* Gender Split */}
          <div className='mb-8'>
            <h3 className='text-xl font-bold mb-4'>Gender Split</h3>
            <input
              type='range'
              min='0'
              max='100'
              value={genderSplit}
              onChange={(e) => setGenderSplit(Number.parseInt(e.target.value))}
              className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black'
            />
            <div className='flex justify-between mt-4 gap-4'>
              <div className='flex-1'>
                <p className='mb-2'>Female Seats</p>
                <input
                  type='number'
                  min={0}
                  value={femaleSeats}
                  readOnly
                  className='w-full px-4 py-3 border rounded-xl focus:outline-none text-lg'
                />
              </div>
              <div className='flex-1'>
                <p className='mb-2'>Males Seats</p>
                <input
                  type='number'
                  min={0}
                  value={maleSeats}
                  readOnly
                  className='w-full px-4 py-3 border rounded-xl focus:outline-none text-lg'
                />
              </div>
            </div>
          </div>

          {/* City-wise Split */}
          <div className='mb-8'>
            <h3 className='text-xl font-bold mb-4'>City-wise Split</h3>
            {flagshipLocations?.length !== 0 &&
              flagshipLocations.map((city, index) => {
                const cityKey = city.name.toLowerCase();
                return (
                  <div key={index} className='mb-4'>
                    <p className='mb-2'>
                      {cityKey.charAt(0).toUpperCase() + cityKey.slice(1)} Seats
                    </p>
                    <div className='flex items-center gap-4'>
                      <button
                        onClick={() => updateCitySeats(cityKey, false)}
                        className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center'
                      >
                        <Minus className='w-6 h-6' />
                      </button>
                      <input
                        type='text'
                        min={0}
                        value={citySeats[cityKey] || 0}
                        onChange={(e) =>
                          setCitySeats({ ...citySeats, [cityKey]: Number(e.target.value) })
                        }
                        required
                        className='flex-1 px-4 py-3 border rounded-xl focus:outline-none text-lg'
                      />
                      <button
                        onClick={() => updateCitySeats(cityKey, true)}
                        className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center'
                      >
                        <Plus className='w-6 h-6' />
                      </button>
                    </div>
                  </div>
                );
              })}
            {errors.citySeats && errors.citySeats['global'] && (
              <p className='text-red-500 text-sm mt-1'>{errors.citySeats['global']}</p>
            )}
          </div>

          {/* Mattress - Bed Split */}
          <div className='mb-8'>
            <h3 className='text-xl font-bold mb-4'>Mattress - Bed Split</h3>
            <input
              type='range'
              min='0'
              max='100'
              value={bedMattressSplit}
              onChange={(e) => setBedMattressSplit(Number.parseInt(e.target.value))}
              className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
            />
            <div className='flex justify-between mt-4 gap-4'>
              <div className='flex-1'>
                <p className='mb-2'>Bed</p>
                <input
                  type='number'
                  min={0}
                  value={bedSeats}
                  readOnly
                  className='w-full px-4 py-3 border rounded-xl focus:outline-none text-lg'
                />
              </div>
              <div className='flex-1'>
                <p className='mb-2'>Mattress</p>
                <input
                  type='number'
                  min={0}
                  value={mattressSeats}
                  readOnly
                  className='w-full px-4 py-3 border rounded-xl focus:outline-none text-lg'
                />
              </div>
            </div>
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

export default withAuth(SeatsAllocation, { allowedRoles: [ROLES.ADMIN] });
