import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import styles from "../styles/styles.css";

export default function MedicineTable({ medicines, filteredMedicines, selectedRows, toggleRowSelection, handleDragEnd }) {
  return (
    <Droppable droppableId="medsTable">
      {(provided) => (
        <table className="table" {...provided.droppableProps} ref={provided.innerRef}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Dosage</th>
              <th>Food</th>
              <th>duration</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedicines.map((med, index) => {
              const originalIndex = medicines.indexOf(med);
              return (
                <Draggable key={originalIndex} draggableId={String(originalIndex)} index={index}>
                  {(provided, snapshot) => (
                    <tr className="row"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                          background: selectedRows.includes(originalIndex)
                          ? "#cce5ff"
                          : snapshot.isDragging
                          ? "#f0f8ff"
                          : "transparent",
                        ...provided.draggableProps.style
                      }}
                      onClick={() => toggleRowSelection(originalIndex)}
                    >
                      <td className="td">{med.name}</td>
                      <td className="td">{med.dosage}</td>
                      <td className="td">{med.food}</td>
                      <td style={{ ...styles.td, fontStyle: "italic", color: "#666" }}>{med.notes}</td>
                    </tr>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </tbody>
        </table>
      )}
    </Droppable>
  );
}
