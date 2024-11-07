"use client";

import { useState } from "react";
import Link from "next/link";

export default function Movie() {
    return(
        <>
        <div className="min-h-screen flex items-center justify-center">
            {/* The above div is a helper div that spans the whole page */}
            {/* The below div is the largest rectangle box that marks the movie area */}
            <div className="relative h-[90vh] w-[90vw] flex bg-gray-700">
                
                <div className="flex flex-col w-1/4 mt-4 ml-4">
                    <div className="h-2/3 overflow-hidden bg-gray-500 rounded-lg">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5D3jGq0cufEC8tVYXMGYaEchWsc3ggGZ92A&s" 
                            alt="movie poster" className="w-full h-full object-contain" />
                        {/* may consider to use object-cover depending on the actual effect*/ }
                    </div>
                    {/* This is the left-top image box */}

                    <div className="h-1/4 mt-6 mb-4 overflow-hidden bg-gray-500 rounded-lg">
                        <p className="text-3xl mt-2 flex justify-center"> Rating: 5.0 / 5.0 </p>
                        <p className="text-m flex justify-center"> (This part will be updated) </p>
                    </div>
                    {/* This is the left-bottom rating box */}
                </div>
                
                <div className="w-1/2 mt-4 ml-4 mb-4 bg-gray-500 rounded-lg overflow-y-auto">
                    <p className="text-5xl mt-2 ml-2"> Movie Title </p>

                    <p className="text-2xl mt-3 ml-2"> Movie Description: </p>
                    <p className="text-m px-2" style={{textAlign: 'justify'}}> 
                        This is Zootopia, an animal movie! Will be replaced by a variable that contains all the descriptions... May consider to restrict the text to 3 lines and add a "show more" button to expand, but this might also be unnecessary if we can use a scroll bar anyway... Also the text is automatically newlined and this is awesome!
                    </p>
                    
                    <p className="text-2xl mt-10 ml-2"> Comments: </p>
                    <div className="px-2 mb-2">
                        <div className="p-1 bg-gray-400 rounded-lg">
                            <p className="text-m"> Andy Peng: </p>
                            <p className="text-m"> I don't know how the comments / commentor can be fetched but we can figure it out </p>
                        </div>
                        <div className="mt-2 p-1 bg-gray-400 rounded-lg">
                            <p className="text-m"> Andy Peng: </p>
                            <p className="text-m"> We might consider adding more functionalities to the comments, such as like & respond </p>
                        </div>
                        <div className="mt-2 p-1 bg-gray-400 rounded-lg">
                            <p className="text-m"> Andy Peng: </p>
                            <p className="text-m"> Depending on the effect, we can separate this comment section from the above description section, so that the users can always see the description while scrolling to view all the comments </p>
                        </div>
                        <div className="mt-2 p-1 bg-gray-400 rounded-lg">
                            <p className="text-m"> Andy Peng: </p>
                            <p className="text-m"> If there's no comments a default message is also needed </p>
                        </div>
                        <div className="mt-2 p-1 bg-gray-400 rounded-lg">
                            <p className="text-m"> Andy Peng: </p>
                            <p className="text-m"> This is a place holder to better show the scroll bar </p>
                        </div>
                        
                    </div>
                </div>
                {/* This is the middle info box */}
                
                <div className="w-1/5 mt-4 ml-4 mb-4 mr-4 overflow-hidden bg-gray-500 rounded-lg overflow-y-auto">
                    <p className="text-5xl mt-2 ml-2"> Checklist </p>

                    <div className="px-2 mt-2 mb-2">
                        <div className="p-1 bg-gray-400 rounded-lg">
                            <p className="text-m"> Andy Peng </p>
                        </div>
                        <div className="mt-2 p-1 bg-gray-400 rounded-lg">
                            <p className="text-m"> Pop up window </p>
                        </div>
                        <div className="mt-2 p-1 bg-gray-400 rounded-lg">
                            <p className="text-m"> Scroll bar available </p>
                        </div>
                    </div>

                </div>
                {/* This is the right-most user list */}

            </div>
        </div>
        </>
    );
}