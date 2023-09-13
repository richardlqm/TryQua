// Importing highlight.js
// @ts-ignore
import { genPlot } from "./acquisitions";

// Class definition for file loading and handling
class FileHandler {
  constructor({ files, titleEl, descrEl }) {
    this.titleEl = titleEl;
    this.files = files;
    this.descrEl = descrEl;
  }

  async loadFile({ name, title, description }) {
    this.titleEl.innerText = title;
    this.descrEl.innerText = description;

    const path = `static/python-examples/${name}`;
    const response = await fetch(path);
    const text = await response.text();
    myCodeMirror.setValue(text);

    // Set mode (if needed, though Python mode should be set by default)
    myCodeMirror.setOption("mode", "python");

    // Ensure syntax highlighting is applied
    setTimeout(() => {
      myCodeMirror.refresh();
    }, 10); // Adjust the delay as needed
  }
}

// Class definition for Python evaluation
class PythonEvaluator {
  constructor({ pyodide, resultsEl }) {
    this.resultsEl = resultsEl;
    this.pyodide = pyodide;
  }

  async evaluatePython() {
    if (!this.pyodide) {
      console.log("pyodide not ready");
      return;
    }

    this.resultsEl.hidden = false;
    let result = this.pyodide.runPython(myCodeMirror.getValue());
    await genPlot(result);

    // Scroll smoothly to resultsEl
    this.resultsEl.scrollIntoView({ behavior: "smooth" });
  }

  quaLoader(packages) {
    var arr = packages.map((pckg) =>
      this.pyodide.loadPackage(`static/python-examples/packages/${pckg}`)
    );
    var dstpckgs = ["numpy", "setuptools", "ssl", "scipy"];
    dstpckgs.forEach((dist_pckg) => {
      console.log("adding: " + dist_pckg);
      arr.push(this.pyodide.loadPackage(dist_pckg));
    });
    return Promise.all(arr);
  }
}

// Setup links
function setupLinks({ files, filesEl, descrEl, titleEl }) {
  files.forEach(({ name, title, description }) => {
    let li = document.createElement("li");
    let a = document.createElement("a");
    a.href = "#";
    a.innerText = title;
    a.addEventListener("click", () => {
      let fileHandler = new FileHandler({ titleEl, descrEl, files });
      fileHandler.loadFile({ name, title, description });
    });

    li.appendChild(a);
    // @ts-ignore
    filesEl.appendChild(li);
  });
}

async function main() {
  // Get a reference to the textarea element
  const myTextArea = document.getElementById("myTextArea");

  // Initialize CodeMirror
  const myCodeMirror = CodeMirror.fromTextArea(myTextArea, {
    mode: "python",
    theme: "material",
    lineNumbers: true,
    lineWrapping: true,
    height: "800px",
    // Add any other options or configurations here
  });
  myCodeMirror.setSize(null, 800)
  globalThis.myCodeMirror = myCodeMirror;
  // @ts-ignore
  let pyodide = loadPyodide();
  let files = await (
    await fetch("static/python-examples/examples.json")
  ).json();
  let setupElements = {
    files: files,
    titleEl: document.getElementById("title"),
    descrEl: document.getElementById("description"),
    filesEl: document.getElementById("file-list"),
    resultsEl: document.getElementById("resultsBox"),
    pyodide: null,
  };
  let runButton = document.getElementById("run");
  // @ts-ignore
  runButton.disabled = true;
  setupLinks(setupElements);
  setupElements.pyodide = await pyodide;
  let pyEval = new PythonEvaluator(setupElements);
  let fileHandler = new FileHandler(setupElements);
  let a = document.createElement("a");

  fileHandler.loadFile(setupElements.files[0]);
  let pckgs = await (
    await fetch("/static/python-examples/packages/pckgindex.json")
  ).json();
  pyEval.quaLoader(pckgs).then(() => {
    // @ts-ignore
    runButton.disabled = false;
    runButton?.addEventListener("click", () => pyEval.evaluatePython());
    pyEval.evaluatePython();
  });
}

// DOMContentLoaded event
document.addEventListener("DOMContentLoaded", main);
