




import { useAuth } from "@/app/context/AuthContext";
import React, { useEffect, useState } from "react";

import "./create.css";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


interface Admission {
  id?: string;
  name: string;
  mobile: string;
  email: string;
  blood_group:string;
  gender: string;
  document_type:string;
  service_id:string;
  due_amount:string;
  amount?: string; 
  type:string;
  payment_method:string;
  tax:string;
  pucc:string;
  branch_id:string;
  first_name:string;
  userfile: File | null;
  document:File | null;
  old_rc:File | null;
  adhar:File | null;
  insurence:File | null;
   user_photo:File | null;
   documents:File | null;
  service_name: string;
  // User_photo:File;
  customer_id:string;
  pay_amount: string | undefined;
  total_amount: string | undefined;
  User_photo?: string;
  
}

interface EditProps {
  showmodal: boolean;
  togglemodal: () => void;
  AdmissionData: Admission | null;
  onSave: (updatedAdmission: Admission) => void;
}


const Edit = ({ showmodal, togglemodal, AdmissionData, onSave }: EditProps) => {
  const { state } = useAuth();
  const [selectedOption, setSelectedOption] = useState<string>("create");
  const [branch, setBranch] = useState<{ id: string; branch_name: string }[]>(
    []
  );
  const [service, setService] = useState<
    { id: string; service_name: string; amount:string }[]
  >([]);

  const [documentchange, setDocumentchange] = useState(false);
  const [documentPreview, setDocumentPreview] = useState<string | null>(null);

  const [userPreview, setUserPreview] = useState<string | null>(null);
  const [userchange, setUserchange] = useState(false);

 
  const [Rcchange, setRcchange] = useState(false);
  const [RcPreview, setRcPreview] = useState<string | null>(null);

  
  
  const [Aadhaarchange, setAadhaarchange] = useState(false);
  const [AadhaarPreview, setAadhaarPreview] = useState<string | null>(null);

  
  const [Insurencechange, setInsurencechange] = useState(false);
  const [InsurencePreview, setInsurencePreview] = useState<string | null>(null);

  const [photo, setPhoto] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenBranch, setIsOpenBranch] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const [selectedAmount, setSelectedAmount] = useState("");
  const [submission, setsubmission] = useState<Admission| null>(null);

  const [formData, setFormData] = useState<Admission| null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageChanged, setImageChanged] = useState(false);

  const fetchbranchData = async () => {
    try {
      const response = await fetch("/api/staff/member/branch_details", {
        method: "POST",
        headers: {
          authorizations: state?.accessToken ?? "",
          api_key: "10f052463f485938d04ac7300de7ec2b",
        },
        body: JSON.stringify({
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        // console.error('API error:', errorData);
        throw new Error(
          `HTTP error! Status: ${response.status} - ${
            errorData.message || "Unknown error"
          }`
        );
      }

      const data = await response.json();

      if (data.success) {
        setBranch(data.data || []);
      } else {
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchbranchData();
  }, [state]);

  const fetchserviceData = async () => {
    try {
      const response = await fetch("/api/staff/member/service_details", {
        method: "POST",
        headers: {
          authorizations: state?.accessToken ?? "",
          api_key: "10f052463f485938d04ac7300de7ec2b",
        },
        body: JSON.stringify({
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! Status: ${response.status} - ${
            errorData.message || "Unknown error"
          }`
        );
      }

      const data = await response.json();

      if (data.success) {
        setService(data.data || []);
      } else {
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchserviceData();
  }, [state]);



  useEffect(() => {
    if (AdmissionData) {
      setFormData(AdmissionData);
    }
  }, [AdmissionData]);

  useEffect(() => {
    if (AdmissionData) {
      setsubmission(AdmissionData);
    }
  }, [AdmissionData]);

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;
  setFormData((prevData) => (prevData ? { ...prevData, [name]: value } : null));
};


const handleDocumentchange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      setDocumentPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setFormData((prevData) => (prevData ? { ...prevData, document: file } : null)); 
    setDocumentchange(true);
  }
};
const handleRemovedocument = () => {
  setDocumentPreview(null); // Clear the image preview
  setFormData((prevData) => (prevData ? { ...prevData, document: null } : null)); // Clear the image file from formData
};

const handleRcchange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      setRcPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setFormData((prevData) => (prevData ? { ...prevData, old_rc: file } : null)); // Store the file in formData
    setRcchange(true); // Set the image change flag to true
  }
};
const handleRemoveRc = () => {
  setRcPreview(null); // Clear the image preview
  setFormData((prevData) => (prevData ? { ...prevData, old_rc: null } : null)); // Clear the image file from formData
};


const handleAadhaarchange= (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      setAadhaarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setFormData((prevData) => (prevData ? { ...prevData,adhar: file } : null)); // Store the file in formData
    setAadhaarchange(true); // Set the image change flag to true
  }
};
const handleRemoveAadhaar = () => {
  setAadhaarPreview(null); // Clear the image preview
  setFormData((prevData) => (prevData ? { ...prevData, adhar: null } : null)); // Clear the image file from formData
};


const handleInsurencechange= (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      setInsurencePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setFormData((prevData) => (prevData ? { ...prevData, insurence: file } : null)); // Store the file in formData
    setInsurencechange(true); // Set the image change flag to true
  }
};
const handleRemoveInsurence = () => {
  setInsurencePreview(null); // Clear the image preview
  setFormData((prevData) => (prevData ? { ...prevData, insurence: null } : null)); // Clear the image file from formData
};

const handleUserchange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      setUserPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setFormData((prevData) => (prevData ? { ...prevData, userfile: file } : null)); // Store the file in formData
    setUserchange(true); // Set the image change flag to true
  }
};
const handleRemoveuser = () => {
  setUserPreview(null); // Clear the image preview
  setFormData((prevData) => (prevData ? { ...prevData,userfile: null } : null)); // Clear the image file from formData
};



const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData) {
    console.error("formData is null or undefined");
    return;
  }

  try {
    const formDataToSend = new FormData();
    formDataToSend.append("update_service", (formData.id ?? "").toString());
    formDataToSend.append("name", formData.first_name ?? "");
    formDataToSend.append("email", formData.email ?? "");
    formDataToSend.append("mobile", formData.mobile ?? "");
    formDataToSend.append("blood_group", formData.blood_group ?? "");
    formDataToSend.append("gender", formData.gender ?? "");
    formDataToSend.append("document_type", formData.document_type ?? "");
    formDataToSend.append("service_id", formData.service_id ?? "");
    formDataToSend.append("pay_amount", formData.pay_amount ?? "0");
    formDataToSend.append("total_amount", formData.amount ?? "0");
    formDataToSend.append("type", formData.type ?? "");
    formDataToSend.append("payment_method", formData.payment_method ?? "cash");
    formDataToSend.append("tax", formData.tax ?? "");
    formDataToSend.append("pucc", formData.pucc ?? "0");
    formDataToSend.append("branch_id", formData.branch_id ?? "");
    formDataToSend.append("id", formData.customer_id ?? "");

    const handleFileUpload = async (key: string, file: File | string | null) => {
      if (file instanceof File) {
        formDataToSend.append(key, file);
      } else if (file && typeof file === 'string') {
        const response = await fetch(file);
        const blob = await response.blob();
        const fileWithFallbackName = new File([blob], "", { type: blob.type });
        formDataToSend.append(key, fileWithFallbackName);
      } else {
        console.error(`${key} is not a valid file or URL`);
      }
    };

    // Handle file uploads
    await handleFileUpload("userfile", formData.userfile);
    await handleFileUpload("document", formData.document);
    await handleFileUpload("old_rc", formData.old_rc);
    await handleFileUpload("adhar", formData.adhar);
    await handleFileUpload("insurence", formData.insurence);

    console.log("Submitting FormData:");
    for (const [key, value] of formDataToSend.entries()) {
      console.log(key, value);
    }

    const response = await fetch(`/api/staff/signup/update_admission`, {
      method: "POST",
      headers: {
        authorizations: state?.accessToken ?? "",
        api_key: "10f052463f485938d04ac7300de7ec2b",
      },
      body: formDataToSend,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseText = await response.text();
    console.log("Raw Response Text:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }

    console.log("Parsed API Response:", data);

    if (response.ok && data?.success) {
      toast.success("Admission Updated successfully!");
      togglemodal();
    } else {
      alert(`Failed to submit: ${data?.msg || "Unknown error"}`);
      toast.error('An error occurred while updating the Admission');
    }
  } catch (err: any) {
    console.error("Error submitting form:", err);
    toast.error(err.msg || 'An error occurred while updating the Admission');
  }
};








const handleSelect = (service: { id: string; service_name: string; amount: string | undefined }) => {
  setFormData((prev) => {
    if (!prev) return null;

    return {
      ...prev,
      service_id: service.id ?? '', 
      service_name: service.service_name ?? '',
      name: prev.name ?? '', 
      mobile: prev.mobile ?? '', 
      email: prev.email ?? '', 
      blood_group: prev.blood_group ?? '', 
      gender: prev.gender ?? '', 
      document_type: prev.document_type ?? '', 
      total_amount: service.amount ?? '',
      pay_amount: prev.pay_amount ?? '',
      customer_id: prev.customer_id ?? '',
      User_photo: prev.User_photo,
    };
  });

  setSelectedService(service.service_name);
  setSelectedAmount(service.amount ?? '');
  setIsOpen(false);
};




  const filteredServices = service.filter((service) =>
    service.service_name.toLowerCase().includes(searchTerm.toLowerCase())
  );



  if (!showmodal) return null;

  return (
    <div
    className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
    role="dialog"
  >
   
    <div
      className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"
      onClick={togglemodal}
    ></div>

    {/* Modal content */}
    <div className="relative flex w-full max-w-6xl origin-top flex-col overflow-hidden rounded-lg bg-white transition-all duration-300 dark:bg-navy-700">
      {/* Modal Header */}
      <div className="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
        <h3 className="text-base font-medium text-slate-700 dark:text-navy-100">
          Edit Admission
        </h3>
        <button
          onClick={togglemodal}
          className="btn -mr-1.5 size-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-4.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Modal Body */}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row max-h-[80vh] overflow-y-auto px-4 py-4 sm:px-5 gap-8">
          <div className="flex-1  p-4">
            <label className="block mb-2 text-lg font-medium text-slate-700 dark:text-navy-100">
              Profile Information
            </label>

            <div className="flex flex-col space-y-8 sm:flex-row sm:space-y-0 sm:space-x-8 mt-2">
              <div className="flex-1 ">
                {/* Profile Information */}
                <div className="mb-4 mt-4 ">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span>Name</span>
                      <span className="relative mt-1.5 flex">
                        <input
                          name="first_name"
                        value={formData?.first_name|| ""}
                          onChange={handleChange}
                          className="form-input peer  mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                          placeholder="name"
                          type="text"
                        />
                      </span>
                    </label>
                    <label className="block">
                      <span>Mobile</span>
                      <span className="relative mt-1.5 flex">
                        <input
                         name="mobile"
                        value={formData?.mobile|| ""}
                          onChange={handleChange}
                          className="form-input peer  mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                          placeholder="mobile"
                          type="text"
                        />
                      </span>
                    </label>
                  </div>

                  {/* Additional Fields */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
                    <label className="block">
                      <span>Email</span>
                      <span className="relative mt-1.5 flex">
                        <input
                         name="email"
                        value={formData?.email || ""}
                          onChange={handleChange}
                          type="text"
                          placeholder="email"
                          className="form-input peer mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        />
                      </span>
                    </label>
                    <label className="block ">
                      <span>Blood Group</span>
                      <span className="relative mt-1.5 flex">
                        <select
                        name="blood_group"
                        value={formData?.blood_group}
                        onChange={handleChange}
                        className="dark:bg-navy-700 form-input peer mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        >
                          <option value="">Select Blood Group</option>
                          <option value="A+">A+ve</option>
                          <option value="O+">O+ve</option>
                          <option value="B+">B+ve</option>
                          <option value="AB+">AB+ve</option>
                          <option value="B-">B-ve</option>
                          <option value="A-">A-ve</option>
                          <option value="O-">O-ve</option>
                        </select>
                      </span>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
                    <label className="block ">
                      <span>Gender</span>
                      <span className="relative mt-1.5 flex">
                        <select
                        name="gender"
                          value={formData?.gender || ""}
                          onChange={handleChange}
                        className="dark:bg-navy-700 form-input peer mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent">
                          <option value="">Select a Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="others">Others</option>
                        </select>
                      </span>
                    </label>

                    <label className="block ">
                      <span>Branch Name</span>
                      <span className="relative mt-1.5 flex">
                        <select
                        name="branch_id"
                        value={formData?.branch_id || ""}
                        onChange={handleChange}
                          className="dark:bg-navy-700 form-select peer mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        >
                          <option>Select a Branch</option>
                          {branch.map((branch) => (
                            <option key={branch.id} value={branch.id}>
                              {branch.branch_name}
                            </option>
                          ))}
                        </select>
                      </span>
                    </label>
                  </div>

                  <label className="block mt-2">
                    <span>Choose Document</span>
                    <span className="relative mt-1.5 flex">
                      <select        
                      name="document_type"               
                      value={formData?. document_type|| ""}
                      onChange={handleChange}
                      className="dark:bg-navy-700 form-select peer mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent">
                        <option value="">Choose Document Type</option>
                        <option value="sslc">SSLC</option>
                        <option value="aadhaar">Aadhaar</option>
                        <option value="birth_certificate">Birth Certificate</option>
                        <option value="passport">Passport</option>
                      </select>
                    </span>
                  </label>

                  <div className="w-full max-w-3xl mx-auto space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       {/* Upload User Photo Section */}
           
                       <div>
                        <label className="block mb-2 mt-4">
                        userphoto
                        </label>

                       
                        <div className="ml-2">
             
             {userPreview? (
     <div className="mb-2">
       <img
         src={userPreview}
         alt="Selected"
         className="w-32 h-32 object-cover border rounded"
       />
     </div>
   ) : (
     <div className="mb-2">
       <img
src={`https://our-demos.com/n/drivingschool_api/assets/images/documents/${formData?.user_photo}`}
         alt="RC Document"
         className="w-32 h-32 object-cover border rounded"
       />
     </div>
   )}
             
              {!userPreview && (
             <label className="flex items-center justify-center border rounded p-2 cursor-pointer bg-blue-500 text-white">
               Select Image
               <input
                 type="file"
                 accept="image/*"
                 onChange={handleUserchange}
                 className="hidden"
               />
             </label>
           )}

           {userPreview  && (
             <div className="mt-2 flex">
               

               <label
                     className="bg-blue-500 text-white p-2 rounded cursor-pointer"
                     htmlFor="imageUpload"
                   >
                     Change
                   </label>
                   <input
                     id="imageUpload"
                     type="file"
                     accept="image/*"
                     onChange={handleUserchange}
                     className="hidden outline-dark border-[1px] border-dark font-bold py-2 px-4 rounded"
                   />

<button
                 type="button"
                 onClick={handleRemoveuser}
                className="outline-dark border-[1px] border-dark font-bold py-1.5 px-4 rounded ml-3"
               >
                 Remove
               </button>
             </div>
           )}
           </div>
                      </div>
                      {/* Upload Document Proof Image Section */}
                      <div>
                        <label className="block mb-2 mt-4">
                        Document Upload
                        </label>

                       
                        <div className="ml-2">
             
             {documentPreview? (
     <div className="mb-2">
       <img
         src={documentPreview}
         alt="Selected"
         className="w-32 h-32 object-cover border rounded"
       />
     </div>
   ) : (
     <div className="mb-2">
       <img
src={`https://our-demos.com/n/drivingschool_api/assets/images/documents/${formData?.documents}`}
         alt="RC Document"
         className="w-32 h-32 object-cover border rounded"
       />
     </div>
   )}
             
              {!documentPreview && (
             <label className="flex items-center justify-center border rounded p-2 cursor-pointer bg-blue-500 text-white">
               Select Image
               <input
                 type="file"
                 accept="image/*"
                 onChange={handleDocumentchange}
                 className="hidden"
               />
             </label>
           )}

           {documentPreview  && (
             <div className="mt-2 flex">
               

               <label
                     className="bg-blue-500 text-white p-2 rounded cursor-pointer"
                     htmlFor="imageUpload"
                   >
                     Change
                   </label>
                   <input
                     id="imageUpload"
                     type="file"
                     accept="image/*"
                     onChange={handleDocumentchange}
                     className="hidden outline-dark border-[1px] border-dark font-bold py-2 px-4 rounded"
                   />

<button
                 type="button"
                 onClick={handleRemovedocument}
                className="outline-dark border-[1px] border-dark font-bold py-1.5 px-4 rounded ml-3"
               >
                 Remove
               </button>
             </div>
           )}
           </div>
                      </div>

          
                     
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Right Section: Service Information */}
          <div className="flex-1 mt-4 sm:mt-0  p-4">
            <label className="block mb-2 text-lg  font-medium text-slate-700 dark:text-navy-100 mt-4">
              Service Information
            </label>
            <div className="space-y-5 p-4 sm:p-5">
          
              <div className="flex">
              <div className="relative flex-1 w-full">
    <div
      className="form-select peer mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9"
      onClick={() => setIsOpen(!isOpen)} 
      
    >
      <span>{formData?.service_name || "Select a Service"}</span> 
    </div>

    {isOpen && (
      <div className="dark:bg-navy-700 absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Search services..."
          className="w-full px-3 py-2 border-b dark:bg-navy-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="max-h-60 overflow-y-auto">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <div
                key={service.id}
                className="cursor-pointer px-3 py-2 hover:bg-gray-200 "
                onClick={() => handleSelect(service)}
              >
                {service.service_name}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-400">No results found</div>
          )}
        </div>
      </div>
    )}
  </div>

<label className="block ml-3 flex-1">
                 
                 <span className="relative  flex">
                   <input
                     name="amount"
                    value={selectedAmount || formData?.amount}
                     readOnly
                     type="text"
                     placeholder="Total Amount"
                     className="form-input peer mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                   />
                 </span>
               </label>
              </div>
              {/* Common Fields */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span>Paid Amount</span>
                  <span className="relative mt-1.5 flex">
                    <input
                      name="pay_amount"
                      value={formData?.pay_amount || ""}
                      readOnly
                      type="text"
                      placeholder="Paid Amount"
                      className="form-input peer mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                    />
                  </span>
                </label>

                <label className="block">
                  <span>Due Amount</span>
                  <span className="relative mt-1.5 flex">
                    <input
                     name="due_amount"
                     value={formData?.due_amount || ""}
                     readOnly
                      type="text"
                      placeholder="Due Amount"
                      className="form-input peer mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                    />
                  </span>
                </label>
              </div>

              {(formData?.service_name === "licence fresh" ||
                formData?.service_name === "renewal licence" ||
                formData?.service_name === "duplicate licence" ||
                formData?.service_name === "licence reentry" ||
                formData?.service_name === "rc transfer") && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
                  <label className="block ">
                    <span className="relative mt-1.5 flex">
                      <select 
                       value={formData?.type || ""}
                      onChange={handleChange}
                      name="type"
                      className="form-input peer mt-1.5  w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent">
                        <option value=''>Select Type</option>
                        <option value="lmc">LMC</option>
                        <option value="mc">MC</option>
                        <option value="both">BOTH</option>
                      </select>
                    </span>
                  </label>
                </div>
              )}

              {(formData?.service_name === "rc transfer" ||
                formData?.service_name === "cf" ||
                formData?.service_name === "cf renewal" ||
                formData?.service_name === "rc renewal" ||
                formData?.service_name === "sfds") && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block ">
                    <span className="relative mt-1.5 flex">
                      <input
                         value={formData?.tax || ""}
                         onChange={handleChange}
                        type="text"
                        placeholder="Tax"
                        className="form-input peer mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                      />
                    </span>
                  </label>
                  <label className="block ">
                    <span className="relative mt-1.5 flex">
                      <input
                         value={formData?.pucc || ""}
                         onChange={handleChange}
                         name="pucc"
                        type="text"
                        placeholder="Pucc"
                        className="form-input peer mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                      />
                    </span>
                  </label>

                  {/* Upload old rc Section */}
                  <div>
                        <label className="block mb-2 mt-4">
                        Old RC
                        </label>
                        <div className="ml-2">
             
             {RcPreview? (
     <div className="mb-2">
       <img
         src={RcPreview}
         alt="Selected"
         className="w-32 h-32 object-cover border rounded"
       />
     </div>
   ) : (
     <div className="mb-2">
       <img
src={`https://our-demos.com/n/drivingschool_api/assets/images/documents/${formData.old_rc}`}
         alt="RC Document"
         className="w-32 h-32 object-cover border rounded"
       />
     </div>
   )}
             
              {!RcPreview && (
             <label className="flex items-center justify-center border rounded p-2 cursor-pointer bg-blue-500 text-white">
               Select Image
               <input
                 type="file"
                 accept="image/*"
                 onChange={handleRcchange}
                 className="hidden"
               />
             </label>
           )}

           {RcPreview  && (
             <div className="mt-2 flex">
               

               <label
                     className="bg-blue-500 text-white p-2 rounded cursor-pointer"
                     htmlFor="imageUpload"
                   >
                     Change
                   </label>
                   <input
                     id="imageUpload"
                     type="file"
                     accept="image/*"
                     onChange={handleRcchange}
                     className="hidden outline-dark border-[1px] border-dark font-bold py-2 px-4 rounded"
                   />

<button
                 type="button"
                 onClick={handleRemoveRc}
                className="outline-dark border-[1px] border-dark font-bold py-1.5 px-4 rounded ml-3"
               >
                 Remove
               </button>
             </div>
           )}
                         </div>
                  </div>

                  {/* Upload Aadhaar  Section */}
                  <div>
                        <label className="block mb-2 mt-4">
                        Aadhaar
                        </label>

                       
                        <div className="ml-2">
             
             {AadhaarPreview? (
     <div className="mb-2">
       <img
         src={AadhaarPreview}
         alt="Selected"
         className="w-32 h-32 object-cover border rounded"
       />
     </div>
   ) : (
     <div className="mb-2">
       <img
src={`https://our-demos.com/n/drivingschool_api/assets/images/documents/${formData?.adhar}`}
         alt="RC Document"
         className="w-32 h-32 object-cover border rounded"
       />
     </div>
   )}
             
              {!AadhaarPreview && (
             <label className="flex items-center justify-center border rounded p-2 cursor-pointer bg-blue-500 text-white">
               Select Image
               <input
                 type="file"
                 accept="image/*"
                 onChange={handleAadhaarchange}
                 className="hidden"
               />
             </label>
           )}

           {AadhaarPreview  && (
             <div className="mt-2 flex">
               

               <label
                     className="bg-blue-500 text-white p-2 rounded cursor-pointer"
                     htmlFor="imageUpload"
                   >
                     Change
                   </label>
                   <input
                     id="imageUpload"
                     type="file"
                     accept="image/*"
                     onChange={handleAadhaarchange}
                     className="hidden outline-dark border-[1px] border-dark font-bold py-2 px-4 rounded"
                   />

<button
                 type="button"
                 onClick={handleRemoveAadhaar}
                className="outline-dark border-[1px] border-dark font-bold py-1.5 px-4 rounded ml-3"
               >
                 Remove
               </button>
             </div>
           )}
           </div>
                      </div>

                  {/* Upload Insurence Section */}
                  <div>
                        <label className="block mb-2 mt-4">
                        Insurence
                        </label>

                       
                        <div className="ml-2">
             
             {InsurencePreview? (
     <div className="mb-2">
       <img
         src={InsurencePreview}
         alt="Selected"
         className="w-32 h-32 object-cover border rounded"
       />
     </div>
   ) : (
     <div className="mb-2">
       <img
src={`https://our-demos.com/n/drivingschool_api/assets/images/documents/${formData?.insurence}`}
         alt="RC Document"
         className="w-32 h-32 object-cover border rounded"
       />
     </div>
   )}
              {!InsurencePreview && (
             <label className="flex items-center justify-center border rounded p-2 cursor-pointer bg-blue-500 text-white">
               Select Image
               <input
                 type="file"
                 accept="image/*"
                 onChange={handleInsurencechange}
                 className="hidden"
               />
             </label>
           )}

           {InsurencePreview  && (
             <div className="mt-2 flex">
               <label
                     className="bg-blue-500 text-white p-2 rounded cursor-pointer"
                     htmlFor="imageUpload"
                   >
                     Change
                   </label>
                   <input
                     id="imageUpload"
                     type="file"
                     accept="image/*"
                     onChange={handleInsurencechange}
                     className="hidden outline-dark border-[1px] border-dark font-bold py-2 px-4 rounded"
                   />

<button
                 type="button"
                 onClick={handleRemoveInsurence}
                className="outline-dark border-[1px] border-dark font-bold py-1.5 px-4 rounded ml-3"
               >
                 Remove
               </button>
             </div>
           )}
           </div>
                      </div>
                </div>
              )}

<button
            type="submit"
            className="bg-primary text-white rounded p-2"
          >
             
         {loading ? 'Updating...' : 'Update'}
          </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
);
};

export default Edit;