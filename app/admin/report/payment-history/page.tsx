
'use client';

import { useAuth } from '@/app/context/AuthContext';
import React, { useEffect, useState } from 'react';
import { CgNotes } from 'react-icons/cg';
import { FaSpinner } from 'react-icons/fa';
import { FiClock } from 'react-icons/fi';
import { IoMdCheckmark } from 'react-icons/io';
import { RiBillFill } from 'react-icons/ri';

type Payment = {
  id?: string;
  payment_status: string;
  service_name: string;
  amount: string;
  added_date: string;
  mobile: string;
  service_id: string;
  user_id: string;
  cus_service_id:string;
};

const Page = () => {
  const { state } = useAuth();
  const [paymentData, setPaymentData] = useState<Payment[]>([]);
  const [filteredData, setFilteredData] = useState<Payment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
 const [isLoading, setIsLoading] = useState(false);


  const fetchPaymentHistory = async () => {
    try {
      const response = await fetch('/api/admin/report/payment_history', {
        method: 'POST',
        headers: {
          'authorizations': state?.accessToken ?? '',
          'api_key': '10f052463f485938d04ac7300de7ec2b',
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      if (data.success) {
        const uniqueData = removeDuplicates(data.data || []);
        setPaymentData(uniqueData);
        setFilteredData(uniqueData);
      } else {
        console.error('API error:', data.msg || 'Unknown error');
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const removeDuplicates = (data: Payment[]) => {
    const seen = new Set<string>();
    return data.filter((item) => {
      const key = `${item.mobile}-${item.service_name}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, [state]);

  const applyFilters = () => {

    let newFilteredData = paymentData;
    if (selectedStatus) {
      newFilteredData = newFilteredData.filter(
        (item) => item.payment_status === selectedStatus
      );
    }
    return newFilteredData;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    const searchFilteredData = paymentData.filter(
      (item) =>
        item.service_name.toLowerCase().includes(value.toLowerCase()) ||
        item.mobile.toLowerCase().includes(value.toLowerCase()) ||
        item.payment_status.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(searchFilteredData);
  };

  // const handleFilterSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const newFilteredData = applyFilters();
  //   setFilteredData(newFilteredData);
  // };
  const handleFilterSubmit = async (e: React.FormEvent) => {
              e.preventDefault();
              setIsLoading(true); // Start loading
            
              // Simulate a delay to show the loader (you can remove this in production)
              await new Promise(resolve => setTimeout(resolve, 1000));
              const newFilteredData = applyFilters();
              setFilteredData(newFilteredData);
              setIsLoading(false); // Stop loading
            };


  // const handleReset = () => {
    const handleReset = async () => {
      setIsLoading(true); 
       await new Promise(resolve => setTimeout(resolve, 1000));
    setSearchTerm('');
    setSelectedStatus('');
    setFilteredData(paymentData);
    setIsLoading(false);
  };

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  return (
   

        <div className=" w-full  pb-8">
 
        
    <div className="flex items-center space-x-4 py-5 lg:py-6">
    <h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
    Payment History
    </h2>
    <div className="hidden h-full py-1 sm:flex">
      <div className="h-full w-px bg-slate-300 dark:bg-navy-600" />
    </div>
    <ul className="hidden flex-wrap items-center space-x-2 sm:flex">
      <li className="flex items-center space-x-2">
        <a className="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent" href="#">Home
        </a>
        <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </li>
      <li>Reports </li>
      <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      <li>Payment History</li>
    </ul>
  </div>

  <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6 mb-4" >
  <div className="card px-4 pb-4 sm:px-5 pt-4">
  <div className="p-4 rounded-lg bg-slate-100 dark:bg-navy-800">

<form>
    
    {/* <div className="gap-4 flex"> */}
    <div className="sm:col-span-2 flex flex-col sm:flex-row gap-4">
      <div className='flex-1' >
        <label
          htmlFor="status"
          className="block text-sm font-medium text-slate-700 dark:text-navy-100"
        >
          Status
        </label>
        <select
          className="mt-1 block w-full rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="">Select Status</option>
          {/* <option value="pending">Pending</option> */}
          <option value="remaining">Remaining</option>
          <option value="completed">Completed</option>
        </select>
     
      </div>
  <div className="flex-1">
      <button
       onClick={handleFilterSubmit}
        type="submit"
        className="mt-5 h-10 inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      ><i className='fa fa-filter' style={{marginTop:'3px',marginRight:'3px'}} ></i>
        Filter
      </button>
      <button
         onClick={handleReset}
        type="button"
        className="ml-5 mt-5 h-10 inline-flex justify-center rounded-md border border-gray-300 bg-warning py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-warningfocus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      ><i className='fa fa-refresh' style={{marginTop:'3px',marginRight:'3px'}}></i>
        Reset
      </button>
      </div>
    </div>
  </form>




  </div>
    </div>
  </div>



  <div className="flex items-center justify-between py-5 lg:py-6">
                <span className="text-lg font-medium text-slate-800 dark:text-navy-50">
                Payment History
                </span>
      
            </div>

                             
  <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6" >
  <div className="card px-4 pb-4 sm:px-5">
  <div className="mt-5">

  
  <div className="gridjs-head">
           
           <div className="gridjs-search">
<input type="search" 
placeholder="Type a keyword..." 
aria-label="Type a keyword..." 
className="gridjs-input gridjs-search-input" 
defaultValue="" 
value={searchTerm}
onChange={handleSearchChange}
/>
</div>
        </div>
        <div className="overflow-x-auto w-full">
  <table className="is-hoverable w-full text-left">
            <thead>
              <tr>
                <th className="whitespace-nowrap rounded-l-lg bg-slate-200 px-3 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                SL No
                </th>
                <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
               Mobile
                </th>
                <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
               Service Name
                </th>
                <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
               Amount
                </th>
                <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                Status
                </th>            
                 
                <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
               Date
                </th> 
                <th className="whitespace-nowrap rounded-r-lg bg-slate-200 px-3 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                Action
                </th> 
          
              </tr>
            </thead>
            <tbody>
            {/* {currentEntries.map((item, index) => ( */}
{isLoading ? (
    <tr>
      <td colSpan={7} className="text-center py-10">
        <FaSpinner className="animate-spin text-4xl text-indigo-500 mx-auto" />
      </td>
    </tr>
  ) : (
    <>

            {currentEntries.length > 0 ?(
              currentEntries.map((item,index) =>(

              
              <tr key={item.id} className="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
                <td className="whitespace-nowrap rounded-l-lg px-4 py-3 sm:px-5">
                {index+indexOfFirstEntry + 1}
                </td>
                <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                {item.mobile}
                </td>
                <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                {item.service_name}
                </td>
                <td className="whitespace-nowrap  px-4 py-3 sm:px-5">
                {item.amount}
                </td>
              
                <td className="whitespace-nowrap  px-4 py-3 sm:px-5">
               
                {item.payment_status === "completed" && (
                <div className="badge space-x-2.5 rounded-full bg-success/10 text-success">
                  {/* <div className="size-2 rounded-full bg-current"/> */}
                   <IoMdCheckmark/>
                  <span>Fully paid</span>
                </div>
                )}
                 {item.payment_status === "pending" && (
                <div className="badge space-x-2.5 rounded-full bg-error/10 text-error">
                  {/* <div className="size-2 rounded-full bg-current"/> */}
                   <FiClock/>
                  <span>Pending</span>
                </div>
                )}
                 {item.payment_status === "remaining" && (
                <div className="badge space-x-2.5 rounded-full bg-info/10 text-info">
                   {/* <div className="size-2 rounded-full bg-current"/> */}
                   <CgNotes/>
                  <span>Partially paid </span>
                </div>
                )}
                  </td>

                
                <td className="whitespace-nowrap  px-4 py-3 sm:px-5">
                {item.added_date}
                </td>
                <td className="whitespace-nowrap rounded-r-lg px-4 py-3 sm:px-5">
                <span>
                      <div className="flex justify-center space-x-2">
                      
                     
                  
<button 
    onClick={() => window.open(`/admin/report/view-payment/${item.user_id}?cus_service_id=${item.cus_service_id}`, '_blank')}
    className="btn size-8 p-0 text-info hover:bg-info/20 focus:bg-info/20 active:bg-info/25"
>
    <RiBillFill />
</button>
                      </div>
                    </span>
                </td>
              </tr>
  
              //  ))}
            ))
          ):(
            <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  No data available
                </td>
              </tr> 
          )
        }
        </>
  )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
        <div>
          Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, totalEntries)} of {totalEntries} entries
        </div>
        <div>
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-md"
          >
            First
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-md"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 border rounded-md ${currentPage === i + 1 ? 'bg-[#4f46e5] text-white' : ''}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-md"
          >
            Next
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-md"
          >
            Last
          </button>
        </div>
      </div>
      </div>
  </div>
  </div>
  </div>
  );
};

export default Page;

