"use client";

// import React, { useState, useEffect } from "react";

// const SuggestionTextarea = () => {
//   const [inputText, setInputText] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [placeholder, setPlaceholder] = useState("Type something...");

//   let timeoutId;
//   var abortController = new AbortController();

//   const handleInputChange = async (e) => {
//     const text = e.target.value;
//     setInputText(text);
//     clearTimeout(timeoutId);

//     // Cancel the previous fetch request
//     abortController.abort();
//     // Create a new AbortController for the current request
//     const newAbortController = new AbortController();
//     abortController = newAbortController;

//     if (/\s$/.test(text) && inputText.length > 0) {
//       timeoutId = setTimeout(async () => {
//         try {
//           const res = await fetch("/api/response", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             signal: newAbortController.signal, // Pass the newAbortController's signal
//             body: JSON.stringify({
//               prompt: text,
//             }),
//           });

//           if (res.ok) {
//             const reader = res.body.getReader();
//             const decoder = new TextDecoder();
//             let done = false;
//             let responseData = "";

//             while (!done) {
//               const { value, done: doneReading } = await reader.read();
//               done = doneReading;
//               const chunk = decoder.decode(value);
//               responseData += chunk;
//             }

//             setSuggestions(responseData.split("\n"));
//           }
//         } catch (error) {
//           if (error.name === "AbortError") {
//             console.log("Request was aborted.");
//           } else {
//             console.error("Error fetching suggestions:", error);
//           }
//         }
//       }, 2000);
//     } else {
//       setSuggestions([]);
//     }
//   };

//   useEffect(() => {
//     // Reset the placeholder if suggestions are empty
//     if (suggestions.length === 0) {
//       setPlaceholder("Type something...");
//     }
//     return () => {
//       clearTimeout(timeoutId);
//       // Cancel the request on unmount
//       abortController.abort();
//     };
//   }, [suggestions]);

//   return (
//     <div>
//       <textarea
//         placeholder={placeholder}
//         className="w-[90vw] mx-auto flex justify-center m-2 p-2 h-24 rounded"
//         value={inputText}
//         onChange={handleInputChange}
//       />

//       <div>
//         <pre
//           style={{
//             whiteSpace: "pre-wrap",
//             wordBreak: "break-word",
//           }}>
//           {suggestions}
//         </pre>
//       </div>
//     </div>
//   );
// };

// export default SuggestionTextarea;
import React, { useState, useEffect, useRef } from "react";

const SuggestionTextarea = () => {
  const [inputText, setInputText] = useState("");
  const [updateInputText, setUpdateInputText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [placeholder, setPlaceholder] = useState("Type something...");
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const textAreaRef = useRef();
  let timeoutId;
  let abortController = new AbortController();

  const handleInputChange = async (e) => {
    const text = e.target.value;
    setInputText(text);
    clearTimeout(timeoutId);

    // Cancel the previous fetch request
    abortController.abort();
    // Create a new AbortController for the current request
    const newAbortController = new AbortController();
    abortController = newAbortController;

    if (/\s$/.test(text) && inputText.length > 0) {
      timeoutId = setTimeout(async () => {
        try {
          const res = await fetch("/api/response", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            signal: newAbortController.signal, // Pass the newAbortController's signal
            body: JSON.stringify({
              prompt: text,
            }),
          });

          if (res.ok) {
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let responseData = "";

            while (!done) {
              const { value, done: doneReading } = await reader.read();
              done = doneReading;
              const chunk = decoder.decode(value);
              responseData += chunk;
              setSuggestions(responseData);
            }

            setSelectedSuggestionIndex(-1); // Reset selected suggestion index
          }
        } catch (error) {
          if (error.name === "AbortError") {
            console.log("Request was aborted.");
          } else {
            console.error("Error fetching suggestions:", error);
          }
        }
      }, 2000);
    } else {
      setSuggestions([]);
      setSelectedSuggestionIndex(-1); // Reset selected suggestion index
    }
  };

  const handleSuggestionClick = (suggestion) => {
    // setInputText(suggestion);
    setInputText(suggestion);
    setSuggestions([]);
    setSelectedSuggestionIndex(-1); // Reset selected suggestion index
  };
  const MergeBothFunc = (e) => {
    const cursorPosition = e.target.selectionStart;

    if (e.key === "ArrowRight" && cursorPosition === e.target.value.length) {
      setInputText(inputText + suggestions);
      setSuggestions([]);
      setSelectedSuggestionIndex(-1);
    }
  };

  return (
    <div className="dark">
      <textarea
        placeholder={placeholder}
        className="w-[90vw] mx-auto flex justify-center m-2 p-2 h-24 rounded"
        value={inputText}
        onChange={handleInputChange}
        ref={textAreaRef}
        onKeyDown={(e) => MergeBothFunc(e)}
      />

      <div>
        <div
          className={`suggestion flex justify-center transition-all cursor-pointer`}
          onClick={() => handleSuggestionClick(suggestions)}>
          {suggestions}
        </div>
      </div>
    </div>
  );
};

export default SuggestionTextarea;
