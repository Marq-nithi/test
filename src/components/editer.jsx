import React, { useEffect, useRef } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import presetWebpage from "grapesjs-preset-webpage";
import "./App.css";

function App() {
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) {
      const editor = grapesjs.init({
        container: "#editor",
        height: "100%",
        fromElement: false,
        storageManager: false,
        plugins: [presetWebpage],
      });

      editorRef.current = editor;

      // Load Saved Template if exists
      const savedData = localStorage.getItem("travel-template");
      if (savedData) {
        editor.loadProjectData(JSON.parse(savedData));
      } else {
        loadDefaultTemplate(editor);
      }

      addCustomBlocks(editor);
    }
  }, []);

  const loadDefaultTemplate = (editor) => {
    editor.setComponents(`
      <section style="padding:60px;background:linear-gradient(135deg,#ff9966,#ff5e62);color:white;text-align:center;">
        <h1>BEST OF SWISS & PARIS</h1>
        <p>7 Nights Europe Tour Package</p>
        <button style="padding:10px 25px;background:white;color:#ff5e62;border:none;border-radius:5px;">Book Now</button>
      </section>

      <section style="padding:50px;">
        <h2>Trip Highlights</h2>
        <ul>
          <li>Eiffel Tower Visit</li>
          <li>Swiss Alps Excursion</li>
          <li>Luxury Hotel Stay</li>
        </ul>
      </section>

      <section style="padding:50px;background:#f4f4f4;">
        <h2>Pricing</h2>
        <p>Total Package: <strong>40,920 AED</strong></p>
      </section>

      <section style="padding:50px;">
        <h2>What's Included</h2>
        <ul>
          <li>Hotel Stay</li>
          <li>Breakfast</li>
          <li>Airport Transfers</li>
        </ul>
      </section>
    `);
  };

  const addCustomBlocks = (editor) => {
    const bm = editor.BlockManager;

    bm.add("hero-section", {
      label: "Hero Section",
      content: `
        <section style="padding:60px;text-align:center;background:#333;color:white;">
          <h1>New Travel Package</h1>
          <p>Edit this text</p>
        </section>`
    });

    bm.add("pricing-box", {
      label: "Pricing Box",
      content: `
        <div style="padding:20px;border:1px solid #ddd;border-radius:10px;">
          <h3>Package Price</h3>
          <p>2999 AED</p>
        </div>`
    });

    bm.add("image-block", {
      label: "Image",
      content: { type: "image" }
    });
  };

  const saveTemplate = () => {
    const data = editorRef.current.getProjectData();
    localStorage.setItem("travel-template", JSON.stringify(data));
    alert("Template Saved!");
  };

  const exportHTML = () => {
    const html = editorRef.current.getHtml();
    const css = editorRef.current.getCss();

    const fullCode = `
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

    const blob = new Blob([fullCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "travel-template.html";
    a.click();
  };

  const resetTemplate = () => {
    if (window.confirm("Reset Template?")) {
      localStorage.removeItem("travel-template");
      window.location.reload();
    }
  };

  return (
    <div className="app-container">
      <div className="topbar">
        <h3>Travel Template Builder</h3>
        <div>
          <button onClick={saveTemplate}>Save</button>
          <button onClick={exportHTML}>Export HTML</button>
          <button onClick={resetTemplate} className="danger">Reset</button>
        </div>
      </div>
      <div id="editor"></div>
    </div>
  );
}

export default App;


body, html, #root {
  height: 100%;
  margin: 0;
  font-family: Arial;
}

.app-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.topbar {
  background: #111;
  color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.topbar button {
  margin-left: 10px;
  padding: 6px 12px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.topbar button:hover {
  opacity: 0.8;
}

.danger {
  background: crimson;
  color: white;
}

#editor {
  flex: 1;
}