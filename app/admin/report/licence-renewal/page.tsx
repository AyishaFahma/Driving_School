'use client'

import { useAuth } from '@/app/context/AuthContext';
import { data } from 'autoprefixer';
import React, { useEffect, useState } from 'react'
import { FaSpinner } from 'react-icons/fa';


export default function LicenceRenewal() {

    const { state } = useAuth() // state is used to store user details and token in contextapi. this is passed into useEffect coz function need to run according to user login or logout state 

    // state to store all renewal data
    const [renewalData, setrenewalData] = useState([])

    //stste for filtering
    const [filteredData, setfilteredData] = useState([])

    //selected service
    const [selectedService, setselectedService] = useState("All")

    const [isLoading, setisLoading] = useState(false)


    //pagination properties
    const [currentPage, setcurrentPage] = useState(1)
    const itemsperPage = 10

    //pagination logic
    const indexOfLastItem = currentPage * itemsperPage
    const indexOfFirstItem = indexOfLastItem - itemsperPage
    //this currentitems is based on filredData .slice
    const currentItems = renewalData.slice(indexOfFirstItem, indexOfLastItem)

    //here also filteredData 
    const totalPage = Math.ceil(renewalData.length / itemsperPage)

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPage)
            setcurrentPage(page)
    }


    //function to get all licence renewal report
    const getAllLicenceReport = async () => {

        try {
            // here request url is provided in fetch and also there is a difference in api key
            const response = await fetch('', {
                method: 'POST',
                headers: { // sending two type of credentials to the backend
                    'authorizations': state?.accessToken ?? '', // user's accesstoken
                    //That token is usually:
                    //Empty at first (before login),
                    //Then set when the user logs in or refreshes,
                    //Or updated when the user logs out or re-authenticates.
                    'api_key': '10f052463f485938d04ac7300de7ec2b', //API key is a secret key that identifies your app or client,
                },
                body: JSON.stringify({})
            });
            console.log(response);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || 'Unknown error'}`);
            }
            const data = await response.json();
            if (data.success) {
                // check data then proceed
                setrenewalData(data)
                //store it into filtered data also
                setfilteredData(data)
            }
            else {
                console.error('API error:', data.msg || 'Unknown error');
            }
        } catch (error) {
            console.log(`fetch error ${error}`);

        }
    }

    //to apply filters
    const applyfilter = (e: React.FormEvent) => {
        e.preventDefault()

        console.log("apply filter function", selectedService);


        // apply filter logic
        if (selectedService === 'All') {
            setfilteredData(renewalData)
        }
        // else{
        //     const filtered = renewalData.filter( (item)=>item.servicename === selectedService)
        //     setfilteredData(filtered)
        // }
    }

    useEffect(() => {
        getAllLicenceReport()
    }, [state])


    return (
        <>
            <div className='w-full pb-8'>

                <div className="flex items-center space-x-4 py-5 lg:py-6">
                    <h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
                        Licence Renewal History
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
                        <li>Licence Renewal History</li>
                    </ul>
                </div>
            </div>

            {/* filter based on service */}

            <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6 mb-4" >
                <div className="card px-4 pb-4 sm:px-5 pt-4">
                    <div className="p-4 rounded-lg bg-slate-100 dark:bg-navy-800">
                        <form>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                {/* Status Select */}
                                <div className='flex-1'>
                                    <label
                                        htmlFor="status"
                                        className="block text-sm font-medium text-slate-700 dark:text-navy-100">
                                        Status
                                    </label>
                                    <select
                                        className="mt-1 block w-full rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
                                        value={selectedService} onChange={(e) => setselectedService(e.target.value)}>
                                        <option value="All">All</option>
                                        <option value="Renewal Licence">Renewal Licence</option>
                                        <option value="Insurance Renewal">Insurance Renewal</option>
                                        <option value="RC Renewal">RC Renewal</option>
                                        <option value="CF Renewal">CF Renewal</option>
                                    </select>
                                </div>
                                <div className='flex-1 mt-6'>
                                    {/* filter button */}
                                    <button
                                        type="submit" onClick={applyfilter}
                                        className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                        <i className='fa fa-filter' style={{ marginTop: '3px', marginRight: '3px' }} ></i>
                                        Filter
                                    </button>
                                    {/* reset button */}
                                    <button
                                        type="button"
                                        onClick={() => { setselectedService("All"), setfilteredData(renewalData) }}
                                        className="ml-4 inline-flex justify-center rounded-md border border-gray-300 bg-warning py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-warningfocus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                        <i className='fa fa-refresh' style={{ marginTop: '3px', marginRight: '3px' }}></i>
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
                    Renewal History
                </span>
            </div>


            {/* table view for licence renewal report */}

            <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6" >
                <div className="card px-4 pb-4 sm:px-5">
                    <div className="mt-5">


                        {/* <div className="gridjs-head">
                            <div className="gridjs-search">
                                <input type="search"
                                    placeholder="Type a keyword..."
                                    aria-label="Type a keyword..."
                                    className="text-sm pl-2 gridjs-input gridjs-search-input"
                                    defaultValue=""
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </div>
                        </div> */}

                        <div className="overflow-x-auto w-full">
                            <table className="is-hoverable w-full text-left">
                                {/* table head */}
                                <thead>
                                    <tr>
                                        <th className="whitespace-nowrap rounded-l-lg bg-slate-200 px-3 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                                            #
                                        </th>
                                        <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                                            License Number
                                        </th>
                                        <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                                            Full Name
                                        </th>
                                        <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                                            Date of Birth
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

                                {/* tbody */}
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={7} className="text-center py-10">
                                                <FaSpinner className="animate-spin text-4xl text-indigo-500 mx-auto" />
                                            </td>
                                        </tr>
                                    ) : (
                                        // currentItems.map = perform for pagination all curly bracket condition are need to be uncommented
                                        // but here filtered data is coming so value according to that check
                                        <>
                                            {/* {currentItems?.length > 0 ? (
                                                currentItems.map( (item , index) => ( */}
                                            <tr className="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">

                                                <td className="whitespace-nowrap rounded-l-lg px-4 py-3 sm:px-5">1</td>

                                                <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                                                    item.licenceno
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                                                    item.name
                                                </td>

                                                <td className="whitespace-nowrap  px-4 py-3 sm:px-5">
                                                    item.dob
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                                                    item.status
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                                                    item.date
                                                </td>

                                                <td className="whitespace-nowrap  px-4 py-3 sm:px-5">
                                                    item.action
                                                </td>

                                            </tr>
                                            {/* ))
                                            ) : ( */}

                                            <tr >
                                                <td colSpan={7} className="text-center py-4 text-gray-500">No Data Available</td>
                                            </tr>

                                            {/* )} */}
                                        </>
                                    )}
                                </tbody>

                            </table>

                            {/* Pagination Controls */}
                            <div className="flex justify-center items-center gap-2 mt-5 flex-wrap">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300">
                                    Prev
                                </button>

                                {[...Array(totalPage)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handlePageChange(i + 1)}
                                        className={`px-3 py-1 rounded ${currentPage === i + 1
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200 hover:bg-gray-300"}`} >

                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPage}
                                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300">
                                    Next
                                </button>
                            </div>
                        </div>


                    </div>
                </div>
            </div>

        </>
    );
}
