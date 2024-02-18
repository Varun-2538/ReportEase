import React from 'react'

const SupportCenterSection = () => {
  return (
    <div id="about" className="bg-gray-900 text-white mt-22 mb-4 px-18 py-4">
      <div className="w-5/6 mx-auto">
        <h1 className="text-4xl font-normal mb-4 px-4">About Us</h1>
        <div className="flex items-center">
          <div className="flex-1 ml-4">
            <p className="text-xl mb-4 mr-4">
              Our project, conceived and developed for Jugaad Hacks, stands as a testament to making the learning process of law students easier and helping them gain insights to legal complexities.
            </p>
            <p className="text-xl mr-4">
              We've poured our academic knowledge and youthful enthusiasm into
              building an AI model that simplifies legal processes and empowers
              law enforcement knowledge for law students.
            </p>
          </div>
          <div className="flex-1">
            <iframe
              className="rounded-md shadow-x1"
              width="560"
              height="315"
              src="https://www.youtube.com/embed/-RQq6KtFvuI" // Use the correct embed URL format
              title="Working of ReportEase"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};



export default SupportCenterSection
