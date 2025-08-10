import React from "react";
import "../styles/styles.css";

export default function MedicineForm({
  form,
  setField,
  toggleTime,
  foodOptions,
  addOrUpdateMedicine,
  editIndex
}) {
  return (
    <div className="formBox">
      <input
        className="input"
        name="name"
        placeholder="Medicine Name"
        value={form.name}
        onChange={(e) => setField("name", e.target.value)}
      />

      <div className="buttonGroup">
        <button
          className={form.morning ? "activeBtn" : "inactiveBtn"}
          onClick={() => toggleTime("morning")}
          type="button"
        >
          Morning
        </button>
        <button
          className={form.afternoon ? "activeBtn" : "inactiveBtn"}
          onClick={() => toggleTime("afternoon")}
          type="button"
        >
          Afternoon
        </button>
        <button
          className={form.night ? "activeBtn" : "inactiveBtn"}
          onClick={() => toggleTime("night")}
          type="button"
        >
          Night
        </button>
      </div>

      <div className="buttonGroup">
        {foodOptions.map((opt) => (
          <button
            key={opt}
            className={form.food === opt ? "activeBtn" : "inactiveBtn"}
            onClick={() => setField("food", opt)}
            type="button"
          >
            {opt}
          </button>
        ))}
      </div>

      <input
        className="input"
        name="notes"
        placeholder="Notes (optional)"
        value={form.notes}
        onChange={(e) => setField("notes", e.target.value)}
      />

      <button className="addBtn" onClick={addOrUpdateMedicine} type="button">
        ✅ {editIndex !== null ? "Update Medicine" : "Save Medicine"}
      </button>
    </div>
  );
}
