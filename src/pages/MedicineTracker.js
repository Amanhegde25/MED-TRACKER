import React, { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import MedicineForm from "../components/MedicineForm";
import MedicineTable from "../components/MedicineTable";
import ActionBar from "../components/ActionBar";
import FloatingButtons from "../components/FloatingButtons";
import PDFModal from "../components/PDFModal";

import "../styles/styles.css";

export default function MedicineTracker() {
  const [medicines, setMedicines] = useState(() => {
    const stored = localStorage.getItem("medicines");
    return stored ? JSON.parse(stored) : [];
  });

  const [showForm, setShowForm] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    name: "",
    morning: false,
    afternoon: false,
    night: false,
    food: "After Food",
    notes: ""
  });

  const foodOptions = ["After Food", "Before Food"];
  const [showPDFForm, setShowPDFForm] = useState(false);
  const [pdfInfo, setPdfInfo] = useState({
    patientName: "",
    doctorName: "",
    mobile: ""
  });

  useEffect(() => {
    const storedMeds = localStorage.getItem("medicines");
    if (storedMeds) {
      setMedicines(JSON.parse(storedMeds));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("medicines", JSON.stringify(medicines));
  }, [medicines]);

  const getDosageString = () => {
    return `${form.morning ? 1 : 0}-${form.afternoon ? 1 : 0}-${form.night ? 1 : 0}`;
  };

  const addOrUpdateMedicine = () => {
    if (!form.name.trim()) return;
    const updated = { ...form, dosage: getDosageString() };

    if (editIndex !== null) {
      const newList = [...medicines];
      newList[editIndex] = updated;
      setMedicines(newList);
    } else {
      setMedicines([...medicines, updated]);
    }
    resetForm();
  };

  const resetForm = () => {
    setForm({
      name: "",
      morning: false,
      afternoon: false,
      night: false,
      food: "After Food",
      notes: ""
    });
    setEditIndex(null);
    setShowForm(false);
    setSelectedRows([]);
  };

  const deleteSelected = () => {
    setMedicines(medicines.filter((_, i) => !selectedRows.includes(i)));
    setSelectedRows([]);
  };

  const startEdit = () => {
    if (selectedRows.length === 1) {
      const med = medicines[selectedRows[0]];
      setForm({
        name: med.name,
        morning: med.dosage[0] === "1",
        afternoon: med.dosage[2] === "1",
        night: med.dosage[4] === "1",
        food: med.food || "After Food",
        notes: med.notes || ""
      });
      setEditIndex(selectedRows[0]);
      setShowForm(true);
    }
  };

  const toggleRowSelection = (index) => {
    setSelectedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleTime = (time) => {
    setForm({ ...form, [time]: !form[time] });
  };

  const setField = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const filteredMedicines = medicines.filter(
    (med) =>
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (med.notes || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(medicines);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setMedicines(items);
  };

  const downloadPDF = () => {
    let n = 30;
    let x = 5;
    const doc = new jsPDF();
    const logo = new Image();
    logo.src = "/logo1.png"; // in public folder
    logo.onload = () => {
      doc.addImage(logo, "PNG", 10, 10, 50, 20);

      doc.setFontSize(11);
      doc.text(`Patient Name: ${pdfInfo.patientName}`, 15, n + x);
      doc.text(`Doctor Name: ${pdfInfo.doctorName}`, 15, n + 2 * x);
      doc.text(`Mobile No: ${pdfInfo.mobile}`, 15, n + 3 * x);

      const now = new Date();
      doc.text(`Date: ${now.toLocaleDateString()}`, 150, n + x);
      doc.text(`Time: ${now.toLocaleTimeString()}`, 150, n + 2 * x);

      autoTable(doc, {
        startY: n + 4 * x,
        head: [["Name", "Dosage", "Food", "Notes"]],
        body: medicines.map((m) => [m.name, m.dosage, m.food, m.notes]),
      });

      doc.save(`${(pdfInfo.patientName || "patient")}_medicines.pdf`);

      setShowPDFForm(false);
      setPdfInfo({ patientName: "", doctorName: "", mobile: "" });
    };
  };

  const resetAllMedicines = () => {
    if (window.confirm("Are you sure you want to clear all medicines?")) {
      setMedicines([]);
      localStorage.removeItem("medicines");
    }
  };

  return (
    <body>
    <div className="container">
      <h2 className="title">💊 Medicine Tracker</h2>

      {showForm && (
        <MedicineForm
          form={form}
          setField={setField}
          toggleTime={toggleTime}
          foodOptions={foodOptions}
          addOrUpdateMedicine={addOrUpdateMedicine}
          editIndex={editIndex}
        />
      )}

      <input
        className="search"
        placeholder="🔍 Search medicine..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ActionBar
        selectedRows={selectedRows}
        startEdit={startEdit}
        deleteSelected={deleteSelected}
      />

      <DragDropContext onDragEnd={handleDragEnd}>
        <MedicineTable
          medicines={medicines}
          filteredMedicines={filteredMedicines}
          selectedRows={selectedRows}
          toggleRowSelection={toggleRowSelection}
        />
      </DragDropContext>

      <FloatingButtons
        showForm={showForm}
        setShowForm={setShowForm}
        resetAllMedicines={resetAllMedicines}
      />

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button className="downloadBtn" onClick={() => setShowPDFForm(true)}>
          📄 Generate PDF
        </button>
      </div>

      {showPDFForm && (
        <PDFModal
          pdfInfo={pdfInfo}
          setPdfInfo={setPdfInfo}
          downloadPDF={downloadPDF}
          setShowPDFForm={setShowPDFForm}
        />
      )}
    </div>
  </body>
  );
}
