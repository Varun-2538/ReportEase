import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Papa from "papaparse";

const DataDisp = () => {
  const location = useLocation();
  const { result, ipcSuggestions } = location.state || {
    result: "",
    ipcSuggestions: [],
  };

  const [name, setName] = useState("");
  const [aadharCard, setAadharCard] = useState("");
  const [criminalRecord, setCriminalRecord] = useState("");

  const handleSearch = () => {
    // Trim leading and trailing spaces from input values
    const trimmedName = name.trim();
    const trimmedAadharCard = aadharCard.trim();

    // Load the CSV file
    Papa.parse("/criminal_records.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data;
        const record = data.find(
          (row) =>
            row.name.trim() === trimmedName &&
            row.aadhar_card_number.trim() === trimmedAadharCard
        );

        if (record) {
          setCriminalRecord(record.criminal_record);
        } else {
          setCriminalRecord("Criminal record not found.");
        }
      },
    });
  };

  return (
    <div className="bg-gray-900 px-36  shadow-md">
      <p className="text-xl font-bold mb-16 pt-3 text-orange-500 ">
        ReportEase
      </p>

      <h1 className="text-3xl font-normal text-white ">
        Text Extraction Results
      </h1>

      {/* Extracted Text Box */}
      <div className="mt-4 bg-gray-800 p-4 rounded-md shadow-md">
        <h2 className="text-3xl font-semibold text-white mb-4">
          Extracted Text:
        </h2>
        <div className="overflow-auto" style={{ maxHeight: "200px" }}>
          <pre className="text-white">{result}</pre>
        </div>
      </div>

      {/* IPC Suggestions Box */}
      {ipcSuggestions.length > 0 && (
        <div className="mt-4 bg-gray-800 p-4 rounded-md shadow-md">
          <h2 className="text-3xl font-semibold text-white mb-4">
            IPC Suggestions with reasons:
          </h2>
          <ul className="text-white">
            {ipcSuggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Criminal Records Search */}
      <div className="mt-4 bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
        <h2 className="text-2xl font-semibold text-white">
          Criminal Records Search:
        </h2>
        <div className="flex flex-col space-y-2">
          <label htmlFor="name" className="text-white font-medium">
            Name:
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 rounded-md text-gray-700 w-full md:w-1/2 lg:w-1/3"
            placeholder="Enter name here"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="aadharCard" className="text-white font-medium">
            Aadhar Card:
          </label>
          <input
            id="aadharCard"
            type="text"
            value={aadharCard}
            onChange={(e) => setAadharCard(e.target.value)}
            className="p-2 rounded-md text-gray-700 w-full md:w-1/2 lg:w-1/3"
            placeholder="Enter Aadhar Card number"
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
          onClick={handleSearch}
        >
          Search Records
        </button>
        <div className="pt-4">
          <h2 className="text-2xl font-semibold text-white">
            Criminal Record:
          </h2>
          <p className="text-white mt-2">{criminalRecord}</p>
        </div>
      </div>
    </div>
  );
};

export default DataDisp;