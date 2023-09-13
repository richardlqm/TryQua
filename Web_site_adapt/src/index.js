// Importing highlight.js
// @ts-ignore
import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";

// Registering the Python language
hljs.registerLanguage("python", python);

hljs.configure({
  languages: ["python"],
  cssSelector: "code.language-python",
  ignoreUnescapedHTML: true,
});

hljs.highlightAll();

// Class definition for file loading and handling
/*class FileHandler {
  constructor({ codeEl, titleEl, descrEl }) {
    this.codeEl = codeEl;
    this.titleEl = titleEl;
    this.descrEl = descrEl;
  }*/
  class FileHandler {
    constructor({ files, codeEl, titleEl, descrEl }) {
      this.codeEl = codeEl;
      this.titleEl = titleEl;
      this.files = files;
      this.descrEl = descrEl;
    }
    
  async loadFile({ title, description, code }) {
    this.titleEl.innerText = title;
    this.descrEl.innerText = description;
    this.codeEl.textContent = code;
    hljs.highlightBlock(this.codeEl);
    const path = `static/python-examples/${code}`;
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

  quaLoader(packages) {
    var arr = packages.map((pckg) =>
      this.pyodide.loadPackage(`static/python-examples/packages/${pckg}`)
    );
    var dstpckgs = ["numpy", "setuptools", "ssl"];
    dstpckgs.forEach((dist_pckg) => {
      console.log("adding: " + dist_pckg);
      arr.push(this.pyodide.loadPackage(dist_pckg));
    });
    return Promise.all(arr);
  }
}


// Setup links
function setupLinks({ files, filesEl, codeEl, descrEl, titleEl,examples}) {
  // Create the file-list div
  const fileListDiv = document.createElement("div");
  fileListDiv.id = "file-list";
  fileListDiv.classList.add("left-panel"); // Add a class for styling
  
  // Append the provided code to the fileListDiv
  const providedCode = `
    <div class=".hghlight-program-1">
    <div class="d-ramsey-map-wrapper">
      <div class="d-ramsey-map-container">
      <div class="program-3-page-1-inner">
        <span class="span">Hello World</span>
      </div>
    </div>
  </div>
    <div class="your-code-page-1" id="yourCodePage1Container">
      <div class="program-3-page-1-inner">
          <div class="your-code"><span class="span">Hello World</span></div>
      </div>
    </div>
    <div class="program-4-page-1">
      <div class="program-3-page-1-inner">
        <div class="your-code"><span class="span">CPMG</span></div>
      </div>
    </div>
    <div class="program-5-page-1">
      <div class="program-3-page-1-inner">
        <div class="your-code"><span class="span">Phase Coherence</span></div>
      </div>
    </div>
    <div class="program-2-page-1 highlight-on-hover" id="rtFrequencyTrackingContainer1" contenteditable="true">
      <div class="program-3-page-1-inner">
        <div class="your-code">
          <span class="span">Frame Rotation</span>
        </div>
      </div>
    </div>
    <div class="run-button-page-1">
    <div class="run-button-page-1-child"></div>
    <div class="group-parent">
      <div class="ellipse-parent">
        <div class="group-item"></div>
        <div class="run" id="run">Run</div>
        </div>
        </div>
    </div>
  `;
  fileListDiv.innerHTML += providedCode;

  // Append the fileListDiv to the left-panel
  document.body.appendChild(fileListDiv);

  // Create examples
  examples.forEach(({ title, description, code }) => {
    let divOuter = document.createElement("div");
    divOuter.classList.add("program-3-page-1");

    let divInner1 = document.createElement("div");
    divInner1.classList.add("program-3-page-1-inner");

    let divInner2 = document.createElement("div");
    divInner2.classList.add("program-3-page-1-inner");
    
    let divContainer = document.createElement("div");
    divContainer.classList.add("q-randomized-benchmarking-container");

    let span = document.createElement("span");
    span.classList.add("span");
    /*span.innerText = ""; */

    let a = document.createElement("a");
    a.href = "#";
    a.innerText = title;
    a.addEventListener("click", () => {
      let fileHandler = new FileHandler({ titleEl, codeEl, descrEl });
      fileHandler.loadFile({ title, description, code });
    });

    divContainer.appendChild(span);
    divContainer.appendChild(document.createTextNode("Calculation"));
    divInner2.appendChild(divContainer);
    divInner1.appendChild(divInner2);
    divOuter.appendChild(divInner1);

    // @ts-ignore
    fileListDiv.appendChild(divOuter);
  });
}

async function main() {
  // @ts-ignore
  let pyodide = loadPyodide();
  let setupElements = {
    codeEl: document.getElementById("quaCode"),
    resultEl: document.getElementById("result"),
    titleEl: document.getElementById("title"),
    descrEl: document.getElementById("description"),
  };
  let runButton = document.getElementById("run");
  // @ts-ignore
  //runButton.disabled = true;

  const examples = [
    {
      title: "Hello World",
      description: "test1",
      code: "hello.py",
      
    },
    {
      title: "Calculation",
      description: "test 2",
      code: "calculation.py",
    },
    {
      title: "CPMG",
      description: "test 3",
      code: "print('CPMG code here')",
    },
    {
      title: "Frame rotation",
      description: "test 3",
      code: "print('CPMG code here')",
    },
    {
      title: "Power Rabi example",
      description: "test 3",
      code: "print('CPMG code here')",
    },
    // Add more examples as needed
  ];

  setupLinks({ examples, ...setupElements });
  setupElements.pyodide = await pyodide;
  let pyEval = new PythonEvaluator(setupElements);
  let fileHandler = new FileHandler(setupElements);

  fileHandler.loadFile(examples[0]);
  let packages = await (
    await fetch("/static/python-examples/packages/pckgindex.json")
  ).json();
  pyEval.quaLoader(packages).then(() => {
    // @ts-ignore
    //runButton.disabled = false;
    runButton?.addEventListener("click", () => pyEval.evaluatePython());
  });
}

// DOMContentLoaded event
document.addEventListener("DOMContentLoaded", main);

/*// Importing highlight.js
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
  constructor({ files, codeEl, titleEl, descrEl }) {
    this.codeEl = codeEl;
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

  quaLoader(packages) {
    var arr = packages.map((pckg) =>
      this.pyodide.loadPackage(`static/python-examples/packages/${pckg}`)
    );
    var dstpckgs = ["numpy", "setuptools", "ssl"];
    dstpckgs.forEach((dist_pckg) => {
      console.log("adding: " + dist_pckg);
      arr.push(this.pyodide.loadPackage(dist_pckg));
    });
    return Promise.all(arr);
  }
}

// Setup links
function setupLinks({ files, filesEl, codeEl, descrEl, titleEl }) { 
 
  const examples = [
      {
        "title": "Hello World",
        "description": "test1",
        "name": "hello.py"
      },
      {
        "title": "Calculation",
        "description": "test 2",
        "name": "calculation.py"
      },
      {
        "title": "CPMG",
        "description": "test 3",
        "name": "cpmg.py"
      },
      {
        "title": "Frame Rotation",
        "description": "test 4",
        "name": "frame_rotation.py"
      },
      {
        "title": "Phase Coherence",
        "description": "test 5",
        "name": "phase_coherence.py"
      },
      {
        "title": "Power Rabi example",
        "description": "test 6",
        "name": "power_rabi.py"
      }
    ];
  
  // Create the file-list div
  const fileListDiv = document.createElement("div");
  fileListDiv.id = "file-list";

  // Append the provided code to the fileListDiv
  const providedCode = `
    <div class="program-3-page-1">
      <div class="program-3-page-1-inner">
        <div class="program-3-page-1-inner">
          <div class="q-randomized-benchmarking-container">
            <span class="span">2</span>Q Randomized Benchmarking
          </div>
        </div>
      </div>
    </div>
    <div class="your-code-page-1" id="yourCodePage1Container">
      <div class="program-3-page-1-inner">
        <div class="program-3-page-1-inner">
          <div class="your-code"><span class="span">Y</span>our Code</div>
        </div>
      </div>
    </div>
    <div class="program-4-page-1">
      <div class="program-3-page-1-inner">
        <div class="your-code"><span class="span">E</span>xperiment 2</div>
      </div>
    </div>
    <div class="program-5-page-1">
      <div class="program-3-page-1-inner">
        <div class="your-code"><span class="span">E</span>xperiment 2</div>
      </div>
    </div>
    <div class="program-2-page-1 highlight-on-hover" id="rtFrequencyTrackingContainer1" contenteditable="true">
      <div class="program-3-page-1-inner">
        <div class="your-code">
          <span class="span">R</span>T frequency Tracking
        </div>
      </div>
    </div>
  `;
  fileListDiv.innerHTML = providedCode;

  // Append the fileListDiv to filesEl
  filesEl.appendChild(fileListDiv);

  // Create examples
  examples.forEach(({ title, description, name }) => {
    let divOuter = document.createElement("div");
    divOuter.classList.add("program-3-page-1");

    let divInner1 = document.createElement("div");
    divInner1.classList.add("program-3-page-1-inner");

    let divInner2 = document.createElement("div");
    divInner2.classList.add("program-3-page-1-inner");

    let divContainer = document.createElement("div");
    divContainer.classList.add("q-randomized-benchmarking-container");

    let span = document.createElement("span");
    span.classList.add("span");
    span.innerText = "2";

    let a = document.createElement("a");
    a.href = "#";
    a.innerText = title;
    a.addEventListener("click", () => {
      let fileHandler = new FileHandler({ titleEl, codeEl, descrEl, files });
      fileHandler.loadFile({ name, title, description });
    });

    divContainer.appendChild(span);
    divContainer.appendChild(document.createTextNode("Q Randomized Benchmarking"));
    divInner2.appendChild(divContainer);
    divInner1.appendChild(divInner2);
    divOuter.appendChild(divInner1);

    // @ts-ignore
    filesEl.appendChild(divOuter);
  });
}
 

  /*files.forEach(({ name, title, description }) => {
    let li = document.createElement("li");
    let a = document.createElement("a");
    a.href = "#";
    a.innerText = title;
    a.addEventListener("click", () => {
      let fileHandler = new FileHandler({ titleEl, codeEl, descrEl, files });
      fileHandler.loadFile({ name, title, description });
    });

    li.appendChild(a);
    // @ts-ignore
    filesEl.appendChild(li);
  });
}
*/
/*
async function main() {
  // @ts-ignore
  let pyodide = loadPyodide();
  /*let files = await (
    await fetch("static/python-examples/examples.json")
  ).json(); *//*
  let setupElements = {
    files: files,
    codeEl: document.getElementById("quaCode"),
    resultEl: document.getElementById("result"),
    titleEl: document.getElementById("title"),
    descrEl: document.getElementById("description"),
   // filesEl: document.getElementById("file-list"),
    pyodide: null,
  };
  let runButton = document.getElementById("run");
  // @ts-ignore
  //runButton.disabled = true;
  setupLinks(setupElements);
  setupElements.pyodide = await pyodide;
  let pyEval = new PythonEvaluator(setupElements);
  let fileHandler = new FileHandler(setupElements);

  fileHandler.loadFile(setupElements.files[0]);
  let pckgs = await (
    await fetch("/static/python-examples/packages/pckgindex.json")
  ).json(); 
  pyEval.quaLoader(pckgs).then(() => {
    // @ts-ignore
    //runButton.disabled = false;
    runButton?.addEventListener("click", () => pyEval.evaluatePython());
  });
}

// DOMContentLoaded event
document.addEventListener("DOMContentLoaded", main);
*/