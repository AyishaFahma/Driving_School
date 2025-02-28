



import { useAuth } from "@/app/context/AuthContext";
import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

interface Admission {
  user_name: string;
  text:string;
  id: string | number;
}

type CreateProps = {
  showmodal: boolean;
  togglemodal: () => void;
  formDatas?: {
    service_id: string;
    vehicle_type: string;
    id: string;
    name: string;
    mobile: string;
    email: string;
    blood_group: string;
    gender: string;
    document_type: string;
    total_amount: string;
    pay_amount: string;
    amount: string;
    type: string;
    payment_method: string;
    tax: string;
    pucc: string;
    branch_id: string;
    first_name: string;
    userfile: File | null;
    document: File | null;
    old_rc: File | null;
    adhar: File | null;
    insurence: File | null;
    user_photo: File | null;
    service_name: string;
    UserPhoto: File | null;
    dob:string;
    address:string;
  };
  isEditing?: boolean;
};

const Create: React.FC<CreateProps> = ({
  showmodal,
  togglemodal,
  formDatas,
  isEditing,
}) => {
  const { state } = useAuth();
  const [selectedOption, setSelectedOption] = useState<string>("create");
  const [branch, setBranch] = useState<{ id: string; branch_name: string }[]>(
    []
  );
  const [service, setService] = useState<
    { id: string; service_name: string }[]
  >([]);
  const [admission, setAdmission] = useState<
    { id: string; user_name: string }[]
  >([]);

  const [signaturePreview, setSignaturePreview] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [documentPreview, setDocumentPreview] = useState<string>("");
  const [oldrcPreview, setOldrcPreview] = useState<string>("");
  const [adharPreview, setAdharPreview] = useState<string>("");
  const [insurencePreview, setInsurencePreview] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  // const [searchMobile, setSearchMobile] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [mobileOpen, setmobileOpen] = useState(false);
  // const [selectedService, setSelectedService] = useState("");
  const [selectedAmount, setSelectedAmount] = useState("");
 
  const [ admission_no, setadmission_no] = useState("");
  const [app_no, setapp_no] = useState("");
  const [name, setname] = useState("");
  const [mobile, setmobile] = useState("");
  const [email, setemail] = useState("");
  const [blood_group, setblood_group] = useState("");
  const [gender, setgender] = useState("");
  const [branch_id, setbranch_id] = useState("");

  const [signature, setsignature] = useState<File | null>(null);
  const [userfile, setuserfile] = useState<File | null>(null);
  const [document, setdocument] = useState<File | null>(null);
  const [old_rc, setold_rc] = useState<File | null>(null);
  const [adhar, setadhar] = useState<File | null>(null);
  const [insurence, setinsurence] = useState<File | null>(null);
  const [payment_method, setpayment_method] = useState("");
  const [service_id, setservice_id] = useState("");
  const [error, setError] = useState('');
  const [pay_amount, setpay_amount] = useState("");
  const [type, settype] = useState("");
  const [amount, setamount] = useState("");
  const [document_type, setdocument_type] = useState("");
  const [tax, settax] = useState("");
  const [pucc, setpucc] = useState("");
  const [dob, setdob] = useState("");
  const [address, setaddress] = useState("");
 
    const [mobileData, setMobileData] = useState([]);
    const [filteredMobile, setFilteredMobile] = useState<Admission[]>([]);
    const [searchMobile, setSearchMobile] = useState("");
    const [selectedMobile, setSelectedMobile] = useState("");

const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [searchBranch, setSearchBranch] = useState("");
  const[searchBranchData,setSearchBranchData] =useState<Admission[]>([]);
  const[filteredBranch,setFilteredBranch]=useState<Admission[]>([]);

 const [selectedService, setSelectedService] = useState<string>("");
  const [searchService, setSearchService] = useState("");
  const[searchServiceData,setSearchServiceData] =useState<Admission[]>([]);
  const[filteredService,setFilteredService]=useState<Admission[]>([]);

  const [selectedAdmission, setSelectedAdmission] = useState<string>("");
  const [searchAdmission, setSearchAdmission] = useState("");
  const[searchAdmissionData,setSearchAdmissionData] =useState<Admission[]>([]);
  const[filteredAdmission,setFilteredAdmission]=useState<Admission[]>([]);



    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isbranchDropdownOpen, setIsbranchDropdownOpen] = useState(false); 
    const [isserviceDropdownOpen, setIsserviceDropdownOpen] = useState(false);
    const [isadmissionDropdownOpen, setIsadmissionDropdownOpen] = useState(false); 
    const userDropdownRef = useRef<HTMLDivElement>(null);
    const admissionDropdownRef = useRef<HTMLDivElement>(null);
    const serviceDropdownRef = useRef<HTMLDivElement>(null);
    const branchDropdownRef = useRef<HTMLDivElement>(null);

    const [loading, setLoading] = useState(false);

  const [localFormData, setLocalFormData] = useState(
    formDatas || {
      name: "",
      mobile: "",
      email: "",
      blood_group: "",
      document_type: "",
      gender: "",
      userfile: "",
      document: "",
      payment_method: "",
      service_id: "",
      total_amount: "",
      pay_amount: "",
      type: "",
      branch_id: "",
      old_rc: "",
      tax: "",
      pucc: "",
        dob:'',
       address:'',
      adhar: "",
      insurence: "",
    }
  );

 
  const fetchAdmissionData = async () => {
    try {
      const response = await fetch("/api/admin/report/get_mobile_user_autocomplete", {
        method: "POST",
        headers: {
          authorizations: state?.accessToken ?? "",

          api_key: "10f052463f485938d04ac7300de7ec2b",
        },
        body: JSON.stringify({ user_id: null }),
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
        setAdmission(data.data.mobile_details || []);
      } else {
        // console.error("API error:", data.msg || "Unknown error");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchAdmissionData();
  }, [state]);
 

  const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setsignature(file);
      setSignaturePreview(URL.createObjectURL(file));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setuserfile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setdocument(file);
      setDocumentPreview(URL.createObjectURL(file));
    }
  };

  const handleOldrcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setold_rc(file);
      setOldrcPreview(URL.createObjectURL(file));
    }
  };

  const handleAdharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setadhar(file);
      setAdharPreview(URL.createObjectURL(file));
    }
  };

  const handleInsurenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setinsurence(file);
      setInsurencePreview(URL.createObjectURL(file));
    }
  };

  const handleRemove = (
    setImage: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    setImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("mobile", mobile);
    formData.append("email", email);
    formData.append("blood_group", blood_group || "");
    formData.append("gender", gender || "");
    formData.append("branch_id", branch_id);
    formData.append("payment_method", payment_method);
    formData.append("service_id", service_id);

    formData.append("total_amount", selectedAmount);
    formData.append("pay_amount", pay_amount);
    formData.append("type", type || "");

    formData.append("document_type", document_type || "");
    formData.append("tax", tax);
    formData.append("pucc", pucc);

    if (userfile) formData.append("userfile", userfile);
    if (document) formData.append("document", document);
    if (old_rc) formData.append("old_rc", old_rc);
    if (adhar) formData.append("adhar", adhar);
    if (insurence) formData.append("insurence", insurence);

    for (const [key, value] of formData.entries()) {
      //console.log(`${key}:`, value);
    }

    console.log("submitting formdata", Object.fromEntries(formData.entries()));
    if ( ! localFormData.name) {
      setError("Name field is required.");
      return;
    }
    if ( ! localFormData.mobile) {
      setError("Mobile field is required.");
      return;
    }
    if ( !localFormData.service_id ) {
      setError("Service field is required.");
      return;
    }
   
    try {
      const response = await fetch("/api/admin/signup/admission", {
        method: "POST",
        headers: {
          authorizations: state?.accessToken ?? "",
          api_key: "10f052463f485938d04ac7300de7ec2b",
        },
        body: formData,
      });

      const data = await response.json();
      console.log("Backend response:", data);

      if (!response.ok) {
        console.error("Failed request details:", data);
        alert(
          data.msg ||
            "Failed to add Admission. Please check the required fields."
        );
        return;
      }
      if (response.ok) {
        alert("Admission added successfully!");
        // togglemodal();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while adding the Admission.");
    }
  };

 

  const fetchMobileData = async (searchTerm = null) => {
   try {
   const response = await fetch("/api/admin/report/get_mobile_user_autocomplete", {
   method: "POST",
   headers: {
   authorizations: state?.accessToken ?? "",
   api_key: "10f052463f485938d04ac7300de7ec2b",
   },
   body: JSON.stringify({ term: searchTerm }),
   });
  
   if (!response.ok) {
   const errorData = await response.json();
   throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || "Unknown error"}`);
   }
  
   const data = await response.json();
  // console.log("Search mobile data", data.data);
  
   if (data.success) {
   setMobileData(data.data.mobile_details || []);
   setFilteredMobile(data.data.mobile_details || []);
   }
   } catch (error) {
   console.error("Fetch error:", error);
   }
  };
  
  // Fetch default mobile data on load
  useEffect(() => {
   fetchMobileData();
  }, [state]);
  
  // Handle search input change
  const handleSearchMobile = (e : any) => {
   const value = e.target.value;
   setSearchMobile(value);
   fetchMobileData(value); 
  };
  
  const handleSelectMobile = (mobile:Admission) => {
   setSelectedMobile(mobile.text);
   setIsDropdownOpen(false);
   setSearchMobile(""); 
  };


    const fetchSearchBranch = async () => {
         try {
           const response = await fetch("/api/admin/report/get_branch_autocomplete", {
             method: "POST",
             headers: {
               authorizations: state?.accessToken ?? "",
               api_key: "10f052463f485938d04ac7300de7ec2b",
             },
             body: JSON.stringify({}),
           });
     
           if (!response.ok) {
             const errorData = await response.json();
             throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || "Unknown error"}`);
           }
     
           const data = await response.json();
          // console.log("Search mobile data", data.data);
     
           if (data.success) {
             setSearchBranchData(data.data.branch_details || []);
             setFilteredBranch(data.data.branch_details || []);
           }
         } catch (error) {
           console.error("Fetch error:", error);
         }
       };
     
       useEffect(() => {
         fetchSearchBranch();
       }, [state]);
     
       const handleSearchBranch = (e : any) => {
         const value = e.target.value;
         setSearchBranch(value);
     
         const searchData = searchBranchData.filter(
           (item) =>
             item.text.toLowerCase().includes(value.toLowerCase())
         );
     
         setFilteredBranch(searchData);
       };
     
       
       const handleSelectBranch = (branch:Admission) => {
         setSelectedBranch(branch.text);
         setSearchBranch("");
         setIsbranchDropdownOpen(false); 
       };
       const fetchSearchService = async () => {
           try {
             const response = await fetch("/api/admin/report/get_service_autocomplete", {
               method: "POST",
               headers: {
                 authorizations: state?.accessToken ?? "",
                 api_key: "10f052463f485938d04ac7300de7ec2b",
               },
               body: JSON.stringify({}),
             });
       
             if (!response.ok) {
               const errorData = await response.json();
               throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || "Unknown error"}`);
             }
       
             const data = await response.json();
             console.log("Search mobile data", data.data);
       
             if (data.success) {
               setSearchServiceData(data.data.service_details || []);
               setFilteredService(data.data.service_details || []);
             }
           } catch (error) {
             console.error("Fetch error:", error);
           }
         };
       
         useEffect(() => {
           fetchSearchService();
         }, [state]);
       
         const handleSearchService = (e : any) => {
           const value = e.target.value;
           setSearchService(value);
       
           const searchData = searchServiceData.filter(
             (item) =>
               item.text.toLowerCase().includes(value.toLowerCase())
           );
       
           setFilteredService(searchData);
         };
       
         
        const handleSelectService = (service: any) => {
          setSelectedService(service.text); // Set selected service
        
          // Reset dependent fields
          setSelectedOption("");
          settype("");
       
          setSelectedAmount("");
        
          setIsserviceDropdownOpen(false); // Close dropdown
        };

        const fetchSearchAdmission = async () => {
          try {
            const response = await fetch("/api/admin/report/get_branch_autocomplete", {
              method: "POST",
              headers: {
                authorizations: state?.accessToken ?? "",
                api_key: "10f052463f485938d04ac7300de7ec2b",
              },
              body: JSON.stringify({}),
            });
      
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || "Unknown error"}`);
            }
      
            const data = await response.json();
           // console.log("Search mobile data", data.data);
      
            if (data.success) {
              setSearchAdmissionData(data.data.admission_details || []);
              setFilteredAdmission(data.data.admission_details || []);
            }
          } catch (error) {
            console.error("Fetch error:", error);
          }
        };
      
        useEffect(() => {
          fetchSearchAdmission();
        }, [state]);
      
        const handleSearchAdmission = (e : any) => {
          const value = e.target.value;
          setSearchAdmission(value);
      
          const searchData = searchAdmissionData.filter(
            (item) =>
              item.text.toLowerCase().includes(value.toLowerCase())
          );
      
          setFilteredAdmission(searchData);
        };
      
        
        const handleSelectAdmission = (admission:Admission) => {
          setSelectedAdmission(admission.text);
          setSearchAdmission("");
          setIsadmissionDropdownOpen(false); 
        };






         useEffect(() => {
          if (typeof window !== "undefined" && globalThis.document) {
            const handleClickOutside = (event: MouseEvent) => {
              if (userDropdownRef.current && event.target instanceof Node) {
                if (!userDropdownRef.current.contains(event.target)) {
                  setIsDropdownOpen(false);
                }
              }
        
              if (admissionDropdownRef.current && event.target instanceof Node) {
                if (!admissionDropdownRef.current.contains(event.target)) {
                  setIsadmissionDropdownOpen(false);
                }
              }

              if (branchDropdownRef.current && event.target instanceof Node) {
                if (!branchDropdownRef.current.contains(event.target)) {
                  setIsbranchDropdownOpen(false);
                }
              }

              if (serviceDropdownRef.current && event.target instanceof Node) {
                if (!serviceDropdownRef.current.contains(event.target)) {
                  setIsserviceDropdownOpen(false);
                }
              }
            };
        
            globalThis.document.addEventListener("mousedown", handleClickOutside);
            return () => globalThis.document.removeEventListener("mousedown", handleClickOutside);
          }
        }, []);
        
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"
        onClick={togglemodal}
      ></div>

      <div className="relative flex w-full max-w-6xl origin-top flex-col overflow-hidden rounded-lg bg-white transition-all duration-300 dark:bg-navy-700">
        <div className="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
          <h3 className="text-base font-medium text-slate-700 dark:text-navy-100">
            {/* {isEditing ? "Edit Admission" : "Add Admission"} */}
            Add Admission
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
        <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col sm:flex-row max-h-[80vh] overflow-y-auto px-4 py-4 sm:px-5 gap-8 hide-scrollbar">
          {/* <div className="flex flex-col sm:flex-row max-h-[80vh] overflow-y-auto px-4 py-4 sm:px-5 gap-8 hide-scrollbar"> */}
           
            {/* <div className="flex-1 p-4 "> */}
            <div className="flex-[4] p-4">
              {/* <div className="p-4 border border-gray-300 shadow-md rounded-lg space-y-8 sm:flex-row sm:space-y-0 sm:space-x-8 mt-2"> */}
              <div className="p-4 border border-gray-300 shadow-md rounded-lg space-y-8 sm:flex-row sm:space-y-0 sm:space-x-8 mt-2 "> 
              <label className="ml-6 block mb-2 text-lg font-medium text-slate-700 dark:text-navy-100">
                Profile Information
              </label>
                <div>
                  {/* Radio Buttons */}
                  <div className="flex items-center space-x-4 mb-4 ml-6 mt-4">
                    <label className="inline-flex items-center space-x-2">
                      <input
                        value="create"
                        checked={selectedOption === "create"}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        className="form-radio is-basic size-4 rounded-full border-slate-400/70 checked:border-primary checked:bg-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:border-accent dark:checked:bg-accent dark:hover:border-accent dark:focus:border-accent"
                        name="create"
                        type="radio"
                      />
                      <span>Create</span>
                    </label>

                    <label className="inline-flex items-center space-x-2">
                      <input
                        value="alreadyCreated"
                        checked={selectedOption === "alreadyCreated"}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        className="form-radio is-basic size-4 rounded-full border-slate-400/70 checked:border-primary checked:bg-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:border-accent dark:checked:bg-accent dark:hover:border-accent dark:focus:border-accent"
                        // name="basic"
                        name="alreadyCreated"
                        type="radio"
                      />
                      <span>Already Created</span>
                    </label>
                  </div>

                  {/* Conditional Input Field */}
                  {selectedOption === "alreadyCreated" && (
                  <>
                    <div className="relative w-full" ref={userDropdownRef}>
                    <label htmlFor="mobile" className="block text-sm font-medium text-slate-700 dark:text-navy-100">
                    Enter Mobile No / Name
                    </label>
                   
                    {/* Dropdown Button */}
                    <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="mt-1 flex w-full items-center justify-between rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm cursor-pointer focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
                    >
                    {selectedMobile || "Select a Mobile / Name"}
                    <span className="ml-2 dark:text-slate-400/70">
                              <FaChevronDown />
                            </span>
                    </div>
                   
                    {/* Dropdown Content */}
                    {isDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg dark:border-navy-600 dark:bg-navy-700">
                    {/* Search Bar Inside Dropdown */}
                    <input
                    type="text"
                    value={searchMobile}
                    onChange={handleSearchMobile}
                    placeholder="Search..."
                    className="w-full border-b border-gray-300 px-3 py-2 text-sm focus:outline-none dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
                    />
                   
                    {/* Dropdown Options */}
                    <ul className="max-h-48 overflow-y-auto hide-scrollbar">
                    {filteredMobile.length > 0 ? (
                    filteredMobile.map((mobile) => (
                    <li
                    key={mobile.id}
                    onClick={() => handleSelectMobile(mobile)}
                    className="cursor-pointer px-3 py-2 hover:bg-indigo-500 hover:text-white dark:hover:bg-navy-500"
                    >
                    {mobile.text}
                    </li>
                    ))
                    ) : (
                    <li className="px-3 py-2 text-gray-500 dark:text-gray-400">No results found</li>
                    )}
                    </ul>
                    </div>
                    )}
                    </div>

<div className="relative w-full mt-4" ref={admissionDropdownRef}>
<label htmlFor="mobile" className="block text-sm font-medium text-slate-700 dark:text-navy-100">
Enter Admission No
</label>

{/* Dropdown Button */}
<div
onClick={() => setIsadmissionDropdownOpen(!isadmissionDropdownOpen)}
className="mt-1 flex w-full items-center justify-between rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm cursor-pointer focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
>
{selectedAdmission || "Select an Admission No"}
<span className="ml-2 dark:text-slate-400/70">
          <FaChevronDown />
        </span>
</div>

{/* Dropdown Content */}
{isadmissionDropdownOpen && (
<div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg dark:border-navy-600 dark:bg-navy-700">
{/* Search Bar Inside Dropdown */}
<input
type="text"
value={searchAdmission}
onChange={handleSearchAdmission}
placeholder="Search..."
className="w-full border-b border-gray-300 px-3 py-2 text-sm focus:outline-none dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
/>

{/* Dropdown Options */}
<ul className="max-h-48 overflow-y-auto hide-scrollbar">
{filteredAdmission.length > 0 ? (
filteredAdmission.map((admission) => (
<li
key={admission.id}
onClick={() => handleSelectAdmission(admission)}
className="cursor-pointer px-3 py-2 hover:bg-indigo-500 hover:text-white dark:hover:bg-navy-500"
>
{admission.text}
</li>
))
) : (
<li className="px-3 py-2 text-gray-500 dark:text-gray-400">No results found</li>
)}
</ul>
</div>
)}
</div>
</>
                  )}

                  {/* Profile Information */}
                  <div className="mb-4 mt-4 ">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
                   {/* admission no */}
                     <label className="block mt-2">
                         <span>Admission No:</span>
                          <span className="relative mt-1 flex">
                            <input
                            name="admission_no"
                            value={admission_no}
                            onChange={(e) => setadmission_no(e.target.value)}
                            className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                            placeholder="Admission No:"
                            type="text"
                          />
                        </span>
                      </label>
 {/*app no */}
                  <label className="block mt-2">
                        <span>Application No:</span>
                        <span className="relative mt-1 flex">
                          <input
                            name="name"
                            value={name}
                            onChange={(e) => setname(e.target.value)}
                            className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                            placeholder="Application No"
                            type="text"
                          />
                        </span>
                      </label>
                      </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
                       {/* name */}
                      <label className="block mt-2">
                        <span>Name*</span>
                        <span className="relative mt-1 flex">
                          <input
                            name="name"
                            value={name}
                            required
                            onChange={(e) => setname(e.target.value)}
                            className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                            placeholder="Name"
                            type="text"
                          />
                        </span>
                      </label>
                       {/* mobile */}
                      <label className="block mt-2">
                        <span>Mobile*</span>
                        <span className="relative mt-1 flex">
                          <input
                            name="mobile"
                            value={mobile}
                            required
                            onChange={(e) => setmobile(e.target.value)}
                            className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                            placeholder="Mobile"
                            type="text"
                            onKeyPress={(e) => {
                              // Allow only numbers, backspace, and dot
                              if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace') {
                                e.preventDefault();
                              }
                            }}
                          />
                        </span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
                       {/* dob */}
                      <label className="block mt-2">
                        <span>D-O-B</span>
                        <span className="relative mt-1 flex">
                          <input
                            name="dob"
                            value={dob}
                            onChange={(e) => setdob(e.target.value)}
                            className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                            placeholder="Date of Birth"
                            type="date"
                          />
                        </span>
                      </label>
                      {/* address */}
                      <label className="block mt-2">
                        <span>Address</span>
                        <span className="relative mt-1 flex">
                          <textarea 
                          rows={2}
                            name="address"
                            value={address}
                            onChange={(e) => setaddress(e.target.value)}
                            className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                            placeholder="Address" 
                          />
                        </span>
                      </label>
                    </div>

                    {/* Additional Fields */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
                      {/* email */}
                      {/* <label className="block">
                        <span>Email</span>
                        <span className="relative mt-1.5 flex">
                          <input
                            name="email"
                            value={email}
                            onChange={(e) => setemail(e.target.value)}
                            type="text"
                            placeholder="Email"
                            className="form-input peer mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                          />
                        </span>
                      </label> */}
                       {/*DL No: */}
                       <label className="block mt-2">
                        <span>DL No:</span>
                        <span className="relative mt-1 flex">
                          <input
                            name="email"
                            value={email}
                            onChange={(e) => setemail(e.target.value)}
                            type="text"
                            placeholder="Dl No"
                            className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                          />
                        </span>
                      </label>
                      {/* blood group */}
                      <label className="block mt-2">
                        <span>Blood Group</span>
                        <span className="relative mt-1 flex">
                          <select
                            name="blood_group"
                            value={blood_group}
                            onChange={(e) => setblood_group(e.target.value)}
                            className="text-sm pl-2 dark:bg-navy-700 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                          >
                            <option>Please Select Blood Group</option>
                            <option value="A+ve">A+ve</option>
                            <option value="O+ve">O+ve</option>
                            <option value="B+ve">B+ve</option>
                            <option value="AB+ve">AB+ve</option>
                            <option value="B-ve">B-ve</option>
                            <option value="A-ve">A-ve</option>
                            <option value="AB-ve">AB-ve</option>
                            <option value="O-ve">O-ve</option>
                          </select>
                        </span>
                      </label>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
                      {/* gender */}
                      <label className="block mt-2">
                        <span>Gender</span>
                        <span className="relative mt-1 flex">
                          <select
                            name="gender"
                            value={gender}
                            onChange={(e) => setgender(e.target.value)}
                            className="text-sm pl-2 dark:bg-navy-700 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                          >
                            <option>Please Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="others">Others</option>
                          </select>
                        </span>
                      </label>
{/* branch name */}
<div className="relative w-full" ref={branchDropdownRef}>
      <label htmlFor="mobile" className="block mt-2 text-sm font-medium text-slate-700 dark:text-navy-100">
       Branch Name
      </label>

      {/* Dropdown Button */}
      <div
        onClick={() => setIsbranchDropdownOpen(!isbranchDropdownOpen)}
        className="text-sm pl-2 mt-1 flex w-full items-center justify-between rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm cursor-pointer focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
      >
        {selectedBranch || "Select a Branch"}
        <span className="ml-2 dark:text-slate-400/70">
                  <FaChevronDown />
                </span>
      </div>

      {/* Dropdown Content */}
      {isbranchDropdownOpen && (
        <div className="absolute z-10 mt-1.5 w-full rounded-md border border-gray-300 bg-white shadow-lg dark:border-navy-600 dark:bg-navy-700">
          {/* Search Bar Inside Dropdown */}
          <input
            type="text"
            value={searchBranch}
            onChange={handleSearchBranch}
            placeholder="Search..."
            className=" w-full border-b border-gray-300 px-3 py-2 text-sm focus:outline-none dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
          />

          {/* Dropdown Options */}
          <ul className="max-h-48 overflow-y-auto hide-scrollbar">
            {filteredBranch.length > 0 ? (
              filteredBranch.map((branch) => (
                <li
                  key={branch.id}
                  onClick={() => handleSelectBranch(branch)}
                  className="cursor-pointer px-3 py-2 hover:bg-indigo-500 hover:text-white dark:hover:bg-navy-500"
                >
                   {branch.text}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-gray-500 dark:text-gray-400">No results found</li>
            )}
          </ul>
        </div>
      )}
    </div>

                    </div>


                    <div className="w-full max-w-3xl mx-auto space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      
{/* Upload user photo*/}
                        <div>
                          <label className="block mb-2 mt-4">User Photo</label>
                          <div
                            className={`border-2 rounded-lg flex items-center justify-center h-42 w-42 sm:h-40 sm:w-40 ${
                              imagePreview
                                ? "border-gray-300"
                                : "border-blue-500"
                            }`}
                          >

                            {imagePreview ? (
                              <img
                                src={imagePreview}
                                alt="Uploaded Photo"
                                className="max-h-full max-w-full object-contain"
                              />
                            ) : (
                              <span className="text-gray-500 text-sm text-center">
                                No image selected
                              </span>
                            )}
                          </div>
                          <div className="mt-4 flex space-x-2">
                            {!userfile ? (
                              <label className="cursor-pointer bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded">
                                Select Image
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageChange}
                                  className="hidden"
                                />
                              </label>
                            ) : (
                              <>
                                <label className="cursor-pointer bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded">
                                  Change
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                  />
                                </label>
                                <button
                                  onClick={() => {
                                    setuserfile(null);
                                    setImagePreview("");
                                  }}
                                  className="outline-dark border-[1px] border-dark font-bold py-2 px-4 rounded"
                                >
                                  Remove
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Upload Signature*/}
                        <div>
                          <label className="block mb-2 mt-4">Signature</label>
                          <div
                            className={`border-2 rounded-lg flex items-center justify-center h-42 w-42 sm:h-40 sm:w-40 ${
                              signaturePreview
                                ? "border-gray-300"
                                : "border-blue-500"
                            }`}
                          >
                            {signaturePreview ? (
                              <img
                                src={signaturePreview}
                                alt="Uploaded Photo"
                                className="max-h-full max-w-full object-contain"
                              />
                            ) : (
                              <span className="text-gray-500 text-sm text-center">
                                No image selected
                              </span>
                            )}
                          </div>
                          <div className="mt-4 flex space-x-2">
                            {!signature ? (
                              <label className="cursor-pointer bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded">
                                Select Image
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleSignatureChange}
                                  className="hidden"
                                />
                              </label>
                            ) : (
                              <>
                                <label className="cursor-pointer bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded">
                                  Change
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleSignatureChange}
                                    className="hidden"
                                  />
                                </label>
                                <button
                                  onClick={() => {
                                    setsignature(null);
                                    setSignaturePreview("");
                                  }}
                                  className="outline-dark border-[1px] border-dark font-bold py-2 px-4 rounded"
                                >
                                  Remove
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
<div className="block">
{/* document */}
<label className="block mt-2">
                      <span>Choose Document</span>
                      <span className="relative mt-1 flex">
                        <select
                          name="document_type"
                          value={document_type}
                          onChange={(e) => setdocument_type(e.target.value)}
                          className="text-sm pl-2 dark:bg-navy-700 form-select peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        >
                          <option>Choose a Document</option>
                          <option value="sslc">SSLC</option>
                          <option value="aadhaar">Aadhaar</option>
                          <option value="birthcertificate">
                            Birth Certificate
                          </option>
                          <option value="passport">Passport</option>
                        </select>
                      </span>
                    </label>
                      {/* Upload Document Proof Image Section */}
                      <div>
                          <label className="block mb-2 mt-4">
                            Document Proof
                          </label>
                          <div
                            className={`border-2 rounded-lg flex items-center justify-center h-42 w-42 sm:h-40 sm:w-40 ${
                              documentPreview
                                ? "border-gray-300"
                                : "border-blue-500"
                            }`}
                          >
                            {documentPreview ? (
                              <img
                                src={documentPreview}
                                alt="Uploaded Document"
                                className="max-h-full max-w-full object-contain"
                              />
                            ) : (
                              <span className="text-gray-500 text-sm text-center">
                                No image selected
                              </span>
                            )}
                          </div>
                          <div className="mt-4 flex space-x-2">
                            {!document ? (
                              <label className="cursor-pointer bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded">
                                Select Image
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleDocumentChange}
                                  className="hidden"
                                />
                              </label>
                            ) : (
                              <>
                                <label className="cursor-pointer bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded">
                                  Change
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleDocumentChange}
                                    className="hidden"
                                  />
                                </label>
                                <button
                                  onClick={() => {
                                    setdocument(null);
                                    setDocumentPreview("");
                                  }}
                                  className="outline-dark border-[1px] border-dark font-bold py-2 px-4 rounded"
                                >
                                  Remove
                                </button>
                              </>
                            )}
                          </div>
                        </div>
  </div>
  <div className="block">
{/* document */}
<label className="block mt-2">
                      <span>Choose Document</span>
                      <span className="relative mt-1 flex">
                        <select
                          name="document_type"
                          value={document_type}
                          onChange={(e) => setdocument_type(e.target.value)}
                          className="text-sm pl-2 dark:bg-navy-700 form-select peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        >
                          <option>Choose a Document</option>
                          <option value="sslc">SSLC</option>
                          <option value="aadhaar">Aadhaar</option>
                          <option value="birthcertificate">
                            Birth Certificate
                          </option>
                          <option value="passport">Passport</option>
                        </select>
                      </span>
                    </label>
                      {/* Upload Document Proof Image Section */}
                      <div>
                          <label className="block mb-2 mt-4">
                            Document Proof
                          </label>
                          <div
                            className={`border-2 rounded-lg flex items-center justify-center h-42 w-42 sm:h-40 sm:w-40 ${
                              documentPreview
                                ? "border-gray-300"
                                : "border-blue-500"
                            }`}
                          >
                            {documentPreview ? (
                              <img
                                src={documentPreview}
                                alt="Uploaded Document"
                                className="max-h-full max-w-full object-contain"
                              />
                            ) : (
                              <span className="text-gray-500 text-sm text-center">
                                No image selected
                              </span>
                            )}
                          </div>
                          <div className="mt-4 flex space-x-2">
                            {!document ? (
                              <label className="cursor-pointer bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded">
                                Select Image
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleDocumentChange}
                                  className="hidden"
                                />
                              </label>
                            ) : (
                              <>
                                <label className="cursor-pointer bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded">
                                  Change
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleDocumentChange}
                                    className="hidden"
                                  />
                                </label>
                                <button
                                  onClick={() => {
                                    setdocument(null);
                                    setDocumentPreview("");
                                  }}
                                  className="outline-dark border-[1px] border-dark font-bold py-2 px-4 rounded"
                                >
                                  Remove
                                </button>
                              </>
                            )}
                          </div>
                        </div>
  </div>

                        </div>
                  </div>

                </div>
              </div>
         
            </div>




            {/* <div className="flex-1 mt-4 sm:mt-0 p-4"> */}
            <div className="flex-[3] mt-4 sm:mt-0 p-4">
          {/* <div className="flex-1 mt-4 sm:mt-0 p-4 border border-gray-300 shadow-md rounded-lg"> */}
             
              <div className="space-y-5 p-4 sm:p-5 border mb-4 mt-2 border-gray-300 shadow-md rounded-lg"> 
              
              <label className="block mb-2 text-lg  font-medium text-slate-700 dark:text-navy-100 mt-1">
                Service Information
              </label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              
              {/* service name */}
<div className="relative w-full" ref={serviceDropdownRef}>
      <label htmlFor="mobile" className="block text-sm font-medium text-slate-700 dark:text-navy-100">
       Service
      </label>

      {/* Dropdown Button */}
      <div
        onClick={() => setIsserviceDropdownOpen(!isserviceDropdownOpen)}
        className="mt-1.5 flex w-full items-center justify-between rounded-md border border-slate-300 bg-white py-2.5 px-3 shadow-sm cursor-pointer focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
      >
        {selectedService || "Select a Service"}
        <span className="ml-2 dark:text-slate-400/70">
                  <FaChevronDown />
                </span>
      </div>

      {/* Dropdown Content */}
      {isserviceDropdownOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg dark:border-navy-600 dark:bg-navy-700">
          {/* Search Bar Inside Dropdown */}
          <input
            type="text"
            value={searchService}
            onChange={handleSearchService}
            placeholder="Search..."
            required
            className="w-full border-b border-gray-300 px-3 py-2 text-sm focus:outline-none dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
          />

          {/* Dropdown Options */}
          <ul className="max-h-48 overflow-y-auto hide-scrollbar">
            {filteredService.length > 0 ? (
              filteredService.map((service) => (
                <li
                  key={service.id}
                  onClick={() => handleSelectService(service)}
                  className="cursor-pointer px-3 py-2 hover:bg-indigo-500 hover:text-white dark:hover:bg-navy-500"
                >
                   {service.text}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-gray-500 dark:text-gray-400">No results found</li>
            )}
          </ul>
        </div>
      )}
    </div>

               {/* bill no*/}
                <label className="block">
                        <span>Bill No:</span>
                        <span className="relative  flex">
                          <input
                            name="name"
                            value={name}
                            onChange={(e) => setname(e.target.value)}
                            className="text-sm pl-2 form-input peer  mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                            placeholder="Bill No:"
                            type="text"
                          />
                        </span>
                      </label>
                      </div>

                        {/* check box */}
<div>
                      {(type === "lmv" ||
                      type === "mc" ||
                      type === "auto")&& (
                       
                    <>   
                
                <label className="inline-flex items-center space-x-2">
  <input 
  className="form-checkbox is-basic size-5 rounded-sm border-slate-400/70 checked:border-primary checked:bg-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:border-accent dark:checked:bg-accent dark:hover:border-accent dark:focus:border-accent" 
  type="checkbox" />
  <span>Study</span>
</label>
 <label className="inline-flex items-center space-x-2 ml-6">
 <input 
 className="form-checkbox is-basic size-5 rounded-sm border-slate-400/70 checked:border-primary checked:bg-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:border-accent dark:checked:bg-accent dark:hover:border-accent dark:focus:border-accent" 
 type="checkbox" />
 <span>Licence</span>
</label>
</>        
                      )}
                     
                      {/* LMV Trial */}
                      {selectedService === "licence fresh" && (
         <label className="inline-flex items-center space-x-2 ml-6">
         <input
           value="lmv_trial"
           checked={selectedOption === "lmv_trial"}
           onChange={(e) => setSelectedOption(e.target.value)}
           className="form-radio is-basic size-4 rounded-full border-slate-400/70 checked:border-primary checked:bg-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:border-accent dark:checked:bg-accent dark:hover:border-accent dark:focus:border-accent"
           // name="basic"
           name="lmv_trial"
           type="radio"
         />
         <span>LMV Trial</span>
       </label>
      )}
      </div>
    


                        {/* both dropdown */}
  {type === "both" && (
     <label className="block ">
     <span>Both Type</span>
    <span className="relative mt-1 flex">
      <select
        // value={type}
        // onChange={(e) => settype(e.target.value)}
        className="text-sm pl-2 dark:bg-navy-700 form-input peer  w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
      >
        <option>Choose Type</option>
        <option value="lmv">LMV MC both Study</option>
        <option value="mc">LMV MC both Licence</option>
        <option value="both">LMV Study MC Licence</option>
        <option value="both">LMV Licence MC Study</option>
        <option value="auto">Both Licence Study</option>
      </select>
    </span>
  </label>
  )}
 

       {/*Trial Amount */}
       {selectedOption === "lmv_trial" && (
         
           <label className="block">
           <span>Trial Amount</span>
           <span className="relative mt-1 flex">
             <input
               type="text"
               placeholder="Trial Amount"
               value={selectedAmount}
               className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
             />
           </span>
         </label>

      )}

 {/* type */}
                {(selectedService === "licence fresh" ||
                  selectedService === "renewal licence" ||
                  selectedService === "duplicate licence" ||
                  selectedService === "licence reentry" ||
                  selectedService === "rc transfer") && (
                    // type
                  <label className="block">
                     <span>Type</span>
                    <span className="relative mt-1 flex">
                      <select
                        value={type}
                        onChange={(e) => settype(e.target.value)}
                        className="text-sm pl-2 dark:bg-navy-700 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                      >
                        <option>Select Type</option>
                        <option value="lmv">LMV</option>
                        <option value="mc">MC</option>
                        <option value="both">BOTH</option>
                        <option value="auto">Auto Rickshaw</option>
                      </select>
                    </span>
                  </label>
                )}

                {/* Common Fields */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                   {/* Payment Method */}
                  <label className="block">
                    <span>Payment Method</span>
                    <span className="relative mt-1 flex">
                      <select
                        value={payment_method}
                        onChange={(e) => setpayment_method(e.target.value)}
                        className="px-5 py-2.5 dark:bg-navy-700 form-input peer w-full rounded-lg border border-slate-300 bg-transparent placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                      >
                        <option>Select Method</option>
                        <option value="cash">Cash</option>
                        <option value="online">Online</option>
                      </select>
                    </span>
                  </label>
                        {/* Service Amount */}
                        {/* <label className="block">
                    <span>Service Amount</span>
                    <span className="relative mt-1 flex">
                      <input
                        type="text"
                        placeholder="Service Amount"
                        value={selectedAmount}
                        className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                      />
                    </span>
                  </label> */}
                     
                       </div>
                       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                               {/* Total Amount */}
                      <label className="block">
                    <span>Total Amount</span>
                    <span className="relative mt-1 flex">
                      <input
                        type="text"
                        placeholder="Total Amount"
                        value={selectedAmount}
                        className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                      />
                    </span>
                  </label>
                    {/* Discount */}
                       <label className="block">
                    <span>Discount</span>
                    <span className="relative mt-1 flex">
                      <input
                        type="text"
                        placeholder="Discount"
                        value={selectedAmount}
                        className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                      />
                    </span>
                  </label>
                     {/*Pay Amount */}
                  <label className="block">
                    <span>Pay Amount</span>
                    <span className="relative mt-1 flex">
                      <input
                        type="text"
                        placeholder="Total Amount"
                        value={selectedAmount}
                        className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                      />
                    </span>
                  </label>
                   {/* Paying Amount */}
                   <label className="block ">
                    <span>Paying Amount</span>
                    <span className="relative mt-1 flex">
                      <input
                        type="number"
                        placeholder="Pay Amount"
                        value={pay_amount}
                        onChange={(e) => setpay_amount(e.target.value)}
                        className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                      />
                    </span>
                  </label>
                   {/* Remarks*/}
                   <label className="block ">
                        <span>Remarks</span>
                        <span className="relative mt-1 flex">
                          <textarea 
                          rows={2}
                            name="address"
                            value={address}
                            onChange={(e) => setaddress(e.target.value)}
                            className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                            // placeholder="Address" 
                          />
                        </span>
                      </label>
                </div>
                {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
                 
                </div> */}
                <button
                  type="submit"
                  className="btn bg-primary font-medium text-white hover:bg-primary-focus rounded p-2 w-1/5">
                   {loading ? 'Adding...' : 'Add'}
                </button>
              </div>
           
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;

