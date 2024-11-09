"use client";

import { useState } from "react";
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

export default function Movie() {
    const [isOpen, setIsOpen] = useState(false);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                {/* Main container */}
                <div className="relative h-[90vh] w-[90vw] flex bg-gray-800 rounded-lg shadow-lg p-4">
                    {/* Left section */}
                    <div className="flex flex-col w-1/4 space-y-6">
                        {/* Movie poster */}
                        <div className="h-2/3 bg-gray-700 rounded-lg overflow-hidden">
                            <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5D3jGq0cufEC8tVYXMGYaEchWsc3ggGZ92A&s"
                                alt="Movie poster"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Rating box */}
                        <div className="h-1/4 bg-gray-700 rounded-lg flex flex-col items-center justify-center">
                            <p className="text-3xl">Rating: 5.0 / 5.0</p>
                            <p className="text-sm">(This part will be updated)</p>
                        </div>
                    </div>

                    {/* Middle section */}
                    <div className="w-1/2 mx-4 bg-gray-700 rounded-lg p-4 overflow-y-auto">
                        <h1 className="text-5xl mb-4">Movie Title</h1>
                        <h2 className="text-2xl mb-2">Movie Description:</h2>
                        <p className="text-sm mb-6 text-justify">
                            This is Zootopia, an animal movie! Will be replaced by a variable that contains all the descriptions...
                        </p>
                        <h2 className="text-2xl mb-2">Comments:</h2>
                        <div className="space-y-4">
                            {/* Comment */}
                            <div className="bg-gray-600 p-2 rounded-lg">
                                <p className="font-semibold">Andy Peng:</p>
                                <p className="text-sm">I don't know how the comments/commenter can be fetched but we can figure it out.</p>
                            </div>
                            {/* Additional comments can be added here */}
                        </div>
                    </div>

                    {/* Right section */}
                    <div className="w-1/5 bg-gray-700 rounded-lg p-4 overflow-y-auto">
                        <h2 className="text-5xl mb-4">Checklist</h2>
                        <div className="space-y-4">
                            {/* Checklist item */}
                            <div className="bg-gray-600 p-2 rounded-lg">
                                <p className="text-sm">Andy Peng</p>
                            </div>
                            {/* Button to open modal */}
                            <Button onClick={open} className="w-full">
                                <div className="bg-gray-600 p-2 rounded-lg text-center">
                                    <p className="text-sm">Pop up window</p>
                                </div>
                            </Button>
                            {/* Additional checklist items can be added here */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <Dialog open={isOpen} as="div" className="relative z-10" onClose={close}>
                <div className="fixed inset-0 bg-black bg-opacity-50" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="w-full max-w-md bg-gray-800 rounded-lg p-6">
                        <DialogTitle as="h3" className="text-lg font-medium text-white">
                            Test stuff Popup
                        </DialogTitle>
                        <p className="mt-2 text-sm text-gray-300">
                            Your payment has been successfully submitted. We’ve sent you an email with all of the details of your order.
                        </p>
                        <div className="mt-4">
                            <Button
                                className="inline-flex items-center justify-center w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onClick={close}
                            >
                                Got it, thanks!
                            </Button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
}
