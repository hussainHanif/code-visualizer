"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sun, Moon, Save } from "lucide-react"; // Changed icons
import html2canvas from "html2canvas";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-dart";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

const CodeVisualizerPro = () => {
  const [codeInput, setCodeInput] = useState("");
  const [timelineData, setTimelineData] = useState([]);
  const [theme, setTheme] = useState("dark");
  const [isLoading, setIsLoading] = useState(false);
  const timelineRef = useRef(null);
  const [elementTypes, setElementTypes] = useState({
    keyword: "#FF79C6",
    class: "#8BE9FD",
    function: "#50FA7B",
    variable: "#F1FA8C",
    operator: theme === "dark" ? "#FFB86C" : "#FF79C6",
    string: "#BD93F9",
    number: "#FF5555",
    boolean: "#FF6E6E",
    comment: "#6272A4",
    import: "#FF79C6",
    decorator: "#FF79C6",
    punctuation: "#F8F8F2",
    bracket: "#FF79C6",
    property: "#8BE9FD",
    space: "transparent",
    default: theme === "dark" ? "#F8F8F2" : "#282A36",
  });

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const keywords = [
    "class",
    "function",
    "const",
    "let",
    "var",
    "if",
    "else",
    "for",
    "while",
    "return",
    "import",
    "from",
    "async",
    "await",
    "try",
    "catch",
    "throw",
    "new",
    "this",
    "super",
  ];

  const tokenizeLine = (line) => {
    const tokens = line.split(/(\s+|[{}()[\],;.])/);

    return tokens
      .map((token) => {
        if (!token) return null;

        let color = elementTypes.default;
        let width = token.length * 8;

        if (token.trim() === "") {
          return {
            text: token,
            color: elementTypes.space,
            width: token.length * 8,
          };
        }

        if (keywords.includes(token)) {
          color = elementTypes.keyword;
        } else if (token.match(/^[A-Z][a-zA-Z0-9]*$/)) {
          color = elementTypes.class;
        } else if (token.match(/^[a-z][a-zA-Z0-9]*(?=\()/)) {
          color = elementTypes.function;
        } else if (token.match(/^[a-z][a-zA-Z0-9]*$/)) {
          color = elementTypes.variable;
        } else if (token.match(/[+\-*/%=<>!&|^~]/)) {
          color = elementTypes.operator;
        } else if (token.match(/^(['"]).*\1$/)) {
          color = elementTypes.string;
        } else if (token.match(/^\d+$/)) {
          color = elementTypes.number;
        } else if (token === "true" || token === "false") {
          color = elementTypes.boolean;
        } else if (token.startsWith("//")) {
          color = elementTypes.comment;
        } else if (token === "import" || token === "from") {
          color = elementTypes.import;
        } else if (token.startsWith("@")) {
          color = elementTypes.decorator;
        } else if (token.match(/[{}()[\]]/)) {
          color = elementTypes.bracket;
        } else if (token.match(/[.,;]/)) {
          color = elementTypes.punctuation;
        }

        return { text: token, color, width };
      })
      .filter(Boolean);
  };

  const handleInputChange = (newCode) => {
    setCodeInput(newCode);
    setTimelineData(generateTimelineFromCode(newCode));
  };

  const exportImage = async () => {
    if (timelineRef.current) {
      setIsLoading(true);
      const clone = timelineRef.current.cloneNode(true);

      // Create a wrapper to include the window in the screenshot
      const wrapper = document.createElement("div");
      wrapper.style.position = "absolute";
      wrapper.style.top = "0";
      wrapper.style.left = "0";
      wrapper.style.width = "100vw";
      wrapper.style.height = "100vh";
      wrapper.style.overflow = "hidden";
      wrapper.style.backgroundColor = window.getComputedStyle(document.body).backgroundColor;
      wrapper.appendChild(clone);

      document.body.appendChild(wrapper);

      const canvas = await html2canvas(wrapper, {
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: "transparent",
        scale: window.devicePixelRatio,
      });

      document.body.removeChild(wrapper);

      const image = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const link = document.createElement("a");

      // Generate a dynamic and fun file name
      const fileNames = [
        "YouRock_🤘.png",
        "CodeMaster_💻.png",
        "BugSquasher_🐞.png",
        "SyntaxWizard_🧙‍♂️.png",
        "DebugNinja_🥷.png",
        "CodeHero_🦸‍♂️.png",
        "EpicCoder_🚀.png",
        "ByteBender_🔧.png",
        "PixelPioneer_🌟.png",
        "CodeCrafter_🛠️.png"
      ];
      const randomFileName = fileNames[Math.floor(Math.random() * fileNames.length)];

      link.download = randomFileName;
      link.href = image;
      link.click();
      setIsLoading(false);
    }
  };

  const generateTimelineFromCode = (code) => {
    const lines = code.split("\n");
    return lines
      .map((line, index) => ({
        id: index + 1,
        segments: tokenizeLine(line),
      }))
      .filter((line) => line.segments.length > 0);
  };
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);

    setElementTypes((prev) => ({
      ...prev,
      operator: savedTheme === "dark" ? "#FFB86C" : "#FF79C6",
      default: savedTheme === "dark" ? "#F8F8F2" : "#282A36",
    }));
    setTimelineData(generateTimelineFromCode(codeInput));
  }, [codeInput, theme]);

  return (
    <div className={`p-6 h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="dancing-magician">
            <div className="magician-body">
              <div className="magician-hat"></div>
              <div className="magician-face">
                <div className="magician-eye left"></div>
                <div className="magician-eye right"></div>
                <div className="magician-smile"></div>
              </div>
              <div className="magician-stick"></div>
            </div>
            {/* <span className="magic-text">Casting Spells...</span> */}
          </div>
        </div>
      )}
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">
          Code Visualizer
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full shadow-lg transform transition-transform hover:scale-105"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            onClick={exportImage}
            className={`p-3 rounded-full shadow-lg transform transition-transform hover:scale-105 ${
              theme === "dark"
                ? "text-white"
                : "text-black"
            }`}
          >
            <Save className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main>
        <h2 className="text-xl font-semibold mb-3">
          Transform your code into a vibrant timeline! 🚀✨
        </h2>

        <div className="flex gap-6 h-[calc(100vh-8rem)]">
          <section className="w-1/2 flex flex-col">
            <div className={`flex items-center justify-between p-2 rounded-t-lg border-b-2 ${theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-gray-200 border-gray-400"}`}>
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <AceEditor
              placeholder="Paste your code here..."
              theme={theme === "dark" ? "dracula" : "github"}
              value={codeInput}
              mode={"dart"}
              width="100%"
              showPrintMargin={false}
              showGutter={false}
              highlightActiveLine={false}
              height="100%"
              setOptions={{
                fontSize: "16px",
              }}
              onChange={handleInputChange}
            />
          </section>

          <section className="w-1/2 flex flex-col">
            <div className={`flex items-center justify-between p-2 rounded-t-lg border-b-2 ${theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-gray-200 border-gray-400"}`}>
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <div
              ref={timelineRef}
              className={`flex-1 overflow-auto rounded-lg p-4 border-t-2 ${theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-white border-gray-400"}`}
            >
              <div className="space-y-2">
                {timelineData.map((row) => (
                  <div key={row.id} className="flex items-center">
                    <span
                      className={`w-8 text-sm font-mono ${theme === "dark" ? "text-purple-300" : "text-gray-600"}`}
                    >
                      {row.id}
                    </span>
                    <div className="flex items-center">
                      {row.segments.map((segment, segIndex) => (
                        <div
                          key={segIndex}
                          className="h-4 rounded transition-all duration-200 hover:opacity-80 mx-[1px]"
                          style={{
                            width: `${segment.width}px`,
                            backgroundColor: segment.color,
                          }}
                          title={segment.text}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`mt-4 p-4 rounded-lg border-t-2 ${theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-white border-gray-400"}`}
            >
              <div className="flex flex-wrap gap-3 text-xs">
                {Object.entries(elementTypes).map(
                  ([key, color]) =>
                    key !== "space" &&
                    key !== "default" && (
                      <div key={key} className="flex items-center">
                        <div
                          className="w-3 h-3 rounded mr-1"
                          style={{ backgroundColor: color }}
                        />
                        <span
                          className={
                            theme === "dark" ? "text-purple-300" : "text-gray-600"
                          }
                        >
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </span>
                      </div>
                    )
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default CodeVisualizerPro;
