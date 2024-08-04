import React, { useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import calendarPDF from "../../assets/calendar.pdf";
// import { rotatePlugin } from "@react-pdf-viewer/rotate";
//import '@react-pdf-viewer/rotate/lib/styles/index.css';

const Calendar = () => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  // Define your theme styles

  return (
    <div style={{ height: "750px", width: "100%" }}>
      <Worker
        workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
      >
        <Viewer
          initialRotation={90}
          fileUrl={calendarPDF}
          plugins={[defaultLayoutPluginInstance]}
          defaultScale={1.7}

        />
      </Worker>
      {/* <div
        style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}
      >
        <button onClick={() => rotatePluginInstance.rotate(90)}>
          <RotateForwardIcon /> Rotate Clockwise
        </button>
        <button onClick={() => rotatePluginInstance.rotate(-90)}>
          <RotateBackwardIcon /> Rotate Counterclockwise
        </button>
      </div> */}
    </div>
  );
};

export default Calendar;
