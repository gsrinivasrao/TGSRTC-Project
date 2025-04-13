import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./LoginForm";
import Form from "./Form";
import Modal from "react-modal";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        return { success: true, message: "Login Successful" };
      } else {
        const error = await response.json();
        return { success: false, message: error.error };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const [formData, setFormData] = useState({
    Date: "",
    PlannedSchedules: "",
    PlannedServices: "",
    PlannedKM: "",
    ActualServices: "",
    ActualKM: "",
    TotalDrivers: "",
    MedicallyUnfit: "",
    SuspendedDrivers: "",
    WeeklyOff: "",
    SpecialOff: "",
    Other: "",
    LongLeave: "",
    SickLeave: "",
    LongAbsent: "",
    LeaveLessThan3Days: "",
    SpotAbsent: "",
    DriversRequired: "",
    DoubleDuty: "",
    OffCancellation: "",
    DriversAsConductors: "",
  });

  const [selectedSheet, setSelectedSheet] = useState("");
  const sheetOptions = ["RNG", "FM", "MBNR", "MHBD"]; // Add all 97 sheet names

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name !== "Date" && !/^\d*$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
  };

  const [submittedData, setSubmittedData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSheet) {
      alert("Please select a sheet before submitting.");
      return;
    }

    try {
      const { Date: dateField, ...otherFields } = formData;
      const [year, month, day] = dateField.split("-");
      const formattedDate = `${day}/${month}/${year}`;

      const submittedPayload = {
        Date: formattedDate,
        SheetName: selectedSheet,
        ...otherFields,
      };

      const response = await fetch("http://localhost:8000/api/submit/", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(submittedPayload),
      });

      console.log("Submitted Payload:", submittedPayload);

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        
        // ✅ Store the submitted data directly instead of fetching again
        setSubmittedData(submittedPayload);
        setIsModalOpen(true);
      } else {
        const error = await response.json();
        alert("Error: " + error.error);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleReset = () => {
    setFormData({
      Date: "",
      PlannedSchedules: "",
      PlannedServices: "",
      PlannedKM: "",
      ActualServices: "",
      ActualKM: "",
      TotalDrivers: "",
      MedicallyUnfit: "",
      SuspendedDrivers: "",
      WeeklyOff: "",
      SpecialOff: "",
      Other: "",
      LongLeave: "",
      SickLeave: "",
      LongAbsent: "",
      LeaveLessThan3Days: "",
      SpotAbsent: "",
      DriversRequired: "",
      DoubleDuty: "",
      OffCancellation: "",
      DriversAsConductors: "",
    });
    setSelectedSheet("");
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm onLogin={handleLogin} isAuthenticated={isAuthenticated} />} />
        <Route
          path="/form"
          element={
            <div className="App">
              <h1>Depot Data Form</h1>
              <form onSubmit={handleSubmit} className="form-container">
                <div className="form-group">
                  <label htmlFor="SheetName">Select Sheet</label>
                  <select id="SheetName" value={selectedSheet} onChange={(e) => setSelectedSheet(e.target.value)} required>
                    <option value="">--Select Sheet--</option>
                    {sheetOptions.map((sheet, index) => (
                      <option key={index} value={sheet}>
                        {sheet}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="Date">Date</label>
                  <input type="date" id="Date" name="Date" value={formData.Date} onChange={handleChange} required />
                </div>
                {Object.keys(formData)
                  .filter((field) => field !== "Date")
                  .map((field, index) => (
                    <div key={index} className="form-group">
                      <label htmlFor={field}>{field.replace(/([A-Z])/g, " $1")}</label>
                      <input type="text" id={field} name={field} value={formData[field]} onChange={handleChange} pattern="\d*" required />
                    </div>
                  ))}
                <div className="button-group">
                  <button type="submit">Submit</button>
                  <button type="button" onClick={handleReset}>Reset</button>
                </div>
              </form>

              {/* ✅ Display submitted data in a modal after submission */}
              <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
                <h2>Submitted Data</h2>
                {submittedData && (
                  <table>
                    <tbody>
                      {Object.entries(submittedData).map(([key, value]) => (
                        <tr key={key}>
                          <td><strong>{key}</strong></td>
                          <td>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                <button onClick={() => setIsModalOpen(false)}>Close</button>
              </Modal>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
