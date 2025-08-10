import React from "react";
import "../styles/styles.css";

export default function PDFModal({
  pdfInfo,
  setPdfInfo,
  downloadPDF,
  setShowPDFForm
}) {
  return (
    <div className="modalOverlay">
      <div className="modalBox">
        <h3>Enter Details</h3>

        <input
          className="input"
          type="text"
          placeholder="Patient Name"
          value={pdfInfo.patientName}
          onChange={(e) =>
            setPdfInfo({ ...pdfInfo, patientName: e.target.value })
          }
        />
        <input
          className="input"
          type="text"
          placeholder="Doctor Name"
          value={pdfInfo.doctorName}
          onChange={(e) =>
            setPdfInfo({ ...pdfInfo, doctorName: e.target.value })
          }
        />
        <input
          className="input"
          type="text"
          placeholder="Mobile No"
          value={pdfInfo.mobile}
          onChange={(e) =>
            setPdfInfo({ ...pdfInfo, mobile: e.target.value })
          }
        />

        <div className="buttonGroup">
          <button className="addBtn" onClick={downloadPDF}>
            Generate PDF
          </button>
          <button
            className="inactiveBtn"
            onClick={() => setShowPDFForm(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
