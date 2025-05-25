import { use, useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import useCustomHook from '@/hooks/useSignUp';
import { BaseUser, SignupUser } from '@/interfaces/signup';
import useRegistrationHook from '@/hooks/useRegistrationHandler';

export default function AdditionalInfo() {
  const router = useRouter()
  const action = useCustomHook();
  const registrationAction = useRegistrationHook();
  const [university, setUniversity] = useState('LUM')
  const [cnic, setCnic] = useState('')
  const [city, setCity] = useState('');
  const [socialLink, setSocial] = useState('')
  const [flagshipId, setFlagshipId] = useState(null);
  const [employmentStatus, setEmploymentStatus] = useState('');

  useEffect(() => {
    const flagshipId = localStorage.getItem('flagshipId');
    if (flagshipId) {
      setFlagshipId(JSON.parse(flagshipId));
    }
    const savedData = JSON.parse(localStorage.getItem('formData') || '{}');
    console.log(savedData);
    if (savedData) {
      setUniversity(savedData?.university || '');
      setCnic(savedData?.cnic || '');
      setSocial(savedData?.socialLink || '');
      setCity(savedData?.city || '');
      setEmploymentStatus(savedData?.employmentStatus || '');
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const savedData = JSON.parse(localStorage.getItem('formData') || '{}');
    const formData = {
      ...savedData, university, cnic, socialLink, city, employmentStatus
    }
    localStorage.setItem('formData', JSON.stringify(formData));
    const payload: BaseUser = { ...formData };
    const { userId, verificationId } = await action.register(payload) as { userId: string, verificationId: string };
    if(flagshipId){
      const registrationString = localStorage.getItem("registration");
      const registration = registrationString ? JSON.parse(registrationString) : {};
      registration.userId = userId;
      const { registrationId, message } = await registrationAction.create(registration) as { registrationId: string, message: string };
      localStorage.setItem("registrationId", JSON.stringify(registrationId))
    }

    const storeData = {
      ...formData, verificationId
    }
    localStorage.setItem('formData', JSON.stringify(storeData));
    router.push('/signup/email-verify')
  };
  return (
    <div className="min-h-screen bg-gray-50 md:flex md:items-center md:justify-center p-0">
      <div className="bg-white min-h-screen w-full max-w-md mx-auto rounded-lg shadow-sm p-3">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-6">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <X className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-semibold">Onboarding</h1>
            <div className='w-12 h-4'></div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-3 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center z-10">
              <div className="w-10 h-10 rounded-full bg-[#F3F3F3] text-[#A6A6A6] flex items-center justify-center text-sm">
                1
              </div>
              <span className="mt-2 text-sm font-medium">Basic</span>
            </div>

            {/* Line (centered absolutely) */}
            <div className="absolute left-6 right-6 top-1/4 transform -translate-y-1/2 z-0">
              <div className="w-full h-0.5 bg-[#F3F3F3]" />
            </div>

            {/* Step 2 (conditionally rendered) */}
            {flagshipId && (
              <>
                <div className="flex flex-col items-center z-10">
                  <div className="w-10 h-10 rounded-full bg-[#F3F3F3] text-[#A6A6A6] flex items-center justify-center text-sm">
                    2
                  </div>
                  <span className="mt-2 text-sm text-gray-600">Flagship</span>
                </div>
              </>
            )}

            {/* Step 3 */}
            <div className="flex flex-col items-center z-10">
              <div className="w-10 h-10 rounded-full bg-black text-white  flex items-center justify-center text-sm">
                {flagshipId ? 3 : 2}
              </div>
              <span className="mt-2 text-sm text-gray-600">Background</span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-8 custom-h2">Some more info</h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* CNIC */}
            <div className="space-y-2">
              <label htmlFor="cnic" className="block text-sm font-medium">
                CNIC
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="cnic"
                  value={cnic}
                  required={true}
                  onChange={(e) => setCnic(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Enter CNIC number"
                />
              </div>
            </div>

            {/* city of residence */}
            <div className="space-y-2">
              <label htmlFor="cnic" className="block text-sm font-medium">
                City of residence
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="city"
                  value={city}
                  required={true}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Enter City of residence"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Are you currently working?</h2>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value="student"
                    checked={employmentStatus === 'student'}
                    onChange={() => setEmploymentStatus("student")}
                    className="mr-2 accent-black"
                    color='black'
                  />
                  I’m a student
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value="employed"
                    checked={employmentStatus === 'employed'}
                    onChange={() => setEmploymentStatus("employed")}
                    className="mr-2 accent-black"
                />
                  Employed Professional
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value="selfEmployed"
                    checked={employmentStatus === 'selfEmployed'}
                    onChange={() => setEmploymentStatus("selfEmployed")}
                    className="mr-2 accent-black"
                  />
                  Self Employed/ Business
                </label>
              </div>
            </div>

            {/* University/Workplace */}
            <div className="space-y-2">
              <label htmlFor="university" className="block text-sm font-medium">
                University/ Workplace/ Institute
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="university"
                  value={university}
                  required={true}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
                {university && (
                  <button
                    type="button"
                    onClick={() => setUniversity('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full hover:bg-black p-1"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-white" />
                  </button>
                )}
              </div>
            </div>

            {/* Social Handle */}
            <div className="space-y-2">
              <label htmlFor="social" className="block text-sm font-medium">
                Socials Handle/Insta
              </label>
              <input
                type="text"
                id="social"
                value={socialLink}
                onChange={(e) => setSocial(e.target.value)}
                required={true}
                placeholder="Instagram"
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-black py-4 rounded-md text-sm font-medium transition-colors mt-8"
            >
              {flagshipId ? "Flagship Preferences" : "Get Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}