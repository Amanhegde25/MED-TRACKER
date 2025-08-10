import React from "react";
import "../styles/styles.css";

export default function FloatingButtons({ showForm, setShowForm, resetAllMedicines }) {
  return (
    <div className="fabContainer">
      <button className="fab" onClick={() => setShowForm(!showForm)}>
        {showForm ? "✖" : "➕"}
      </button>
      <button className="resetFab" onClick={resetAllMedicines}>♻</button>
    </div>
  );
}
