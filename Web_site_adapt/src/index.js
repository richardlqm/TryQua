// Importing highlight.js
// @ts-ignore
import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";
// import pyodide, { loadPyodide } from "pyodide/pyodide.js";

// Registering the Python language
hljs.registerLanguage("python", python);

hljs.configure({
  languages: ["python"],
  cssSelector: "code.language-python",
  ignoreUnescapedHTML: true,
});

hljs.highlightAll();

// Class definition for file loading and handling
class FileHandler {
  constructor({ files, codeEl, titleEl }) {
    this.codeEl = codeEl;
    this.titleEl = titleEl;
    this.files = files;
  }

  async loadFile({ name, title }) {
    this.titleEl.innerText = title;
    const path = `static/python-examples/${name}`;

    const response = await fetch(path);

    const text = await response.text();
    this.codeEl.textContent = text.trim();
    hljs.highlightBlock(this.codeEl);

    ["input", "change"].forEach((listener) => {
      // @ts-ignore
      this.codeEl.addEventListener(listener, (e) => {
        // Code highlighting logic
      });
    });
  }
}

// Class definition for Python evaluation
class PythonEvaluator {
  constructor({ pyodide, codeEl, resultEl }) {
    this.pyodide = pyodide;
    this.resultEl = resultEl;
    this.codeEl = codeEl;
  }

  async evaluatePython() {
    if (!this.pyodide) {
      console.log("pyodide not ready");
      return;
    }

    this.resultEl.innerText = this.pyodide.runPython(this.codeEl.textContent);
  }

  quaLoader(pckg) {
    return this.pyodide.loadPackage(`static/python-examples/packages/${pckg}`);
  }
}

// Setup links
function setupLinks({ files, filesEl, codeEl, titleEl }) {
  files.forEach(({ name, title }) => {
    let li = document.createElement("li");
    let a = document.createElement("a");
    a.href = "#";
    a.innerText = title;
    a.addEventListener("click", () => {
      let fileHandler = new FileHandler({ titleEl, codeEl, files });
      fileHandler.loadFile({ name, title });
    });

    li.appendChild(a);
    // @ts-ignore
    filesEl.appendChild(li);
  });
}

async function main() {
  // @ts-ignore
  let pyodide = await loadPyodide();
  let setupElements = {
    files: [
      { title: "A simple hello world", name: "hello.py" },
      { title: "A complex calculation", name: "calculation.py" },
      { title: "CPMG Example", name: "cpmg.py" },
      { title: "Frame Rotation example", name: "frame_rotation.py" },
      { title: "Phase Coherence example", name: "phase_coherence.py" },
      { title: "Power Rabi example", name: "power_rabi.py" },
    ],
    codeEl: document.querySelector("code.language-python"),
    resultEl: document.getElementById("result"),
    titleEl: document.querySelector("#title"),
    filesEl: document.querySelector("div#file-list"),
    pyodide: pyodide,
  };
  let runButton = document.getElementById("run");
  // @ts-ignore
  runButton.disabled = true;
  setupLinks(setupElements);

  let pyEval = new PythonEvaluator(setupElements);
  let fileHandler = new FileHandler(setupElements);

  fileHandler.loadFile(setupElements.files[0]);
  pyEval.quaLoader("qua_emulator.whl").then(() => {
    // @ts-ignore
    runButton.disabled = false;
    runButton?.addEventListener("click", () => pyEval.evaluatePython());
  });
}

// DOMContentLoaded event
document.addEventListener("DOMContentLoaded", main);
