import React from "react";
import styles from "../styles/styles.css";

export default function ActionBar({ selectedRows, startEdit, deleteSelected }) {
  if (selectedRows.length === 0) return null;

  return (
    <div className="actionsBar">
      
      <button className="deleteBtn" onClick={deleteSelected}>
        🗑 Delete ({selectedRows.length})
      </button>
      {selectedRows.length === 1 && (
        <button className="editBtn" onClick={startEdit}>
          ✏️ Edit
        </button>
      )}
    </div>
  );
}

