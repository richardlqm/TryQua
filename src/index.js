import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";
// Then register the languages you need
hljs.registerLanguage("python", python);
hljs.configure({
  languages: ["python"],
  cssSelector: "code.language-python",
  ignoreUnescapedHTML: true,
});
hljs.highlightAll();

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// fetch a file "hello.py" and read the string, set it on tag
fetch("static/hello.py").then((response) => {
  // trim and set the response
  let codeEl = document.querySelector("code.language-python");
  let codeText = "";
  response.text().then((text) => {
    codeEl.textContent = escapeHtml(text.trim());
    codeText = codeEl.textContent;
    hljs.highlightBlock(codeEl);
  });
  // on change, type or modify rehighlight
  const listeners = ["input", "change"];
  listeners.forEach((listener) => {
    // get selection, keep it and set it after
    codeEl?.addEventListener(listener, (e) => {
      codeText = e.target.textContent;
      // re highlight and set selection back
      const selectionStart = window.getSelection().getRangeAt(0).startOffset;
      // hljs.highlightElement(codeEl);
      // A bug with the cursor jumping always to the beginning blocks me
      // console.log(selectionStart);
      // hljs.highlightBlock(codeEl);
      // window.getSelection().getRangeAt(0).setStart(codeEl, selectionStart);
    });
  });
});

async function evaluatePython(pyodide) {
  console.log("evaluatePython");
  if (!pyodide) {
    console.log("pyodide not ready");
    return;
  }
  var codeEl = document.querySelector("code.language-python");
  let resultEl = document.getElementById("result");
  console.log(codeEl?.textContent);
  resultEl.innerText = pyodide.runPython(codeEl?.textContent);
}

async function main() {
  let pyodide = await loadPyodide();
  var runButton = document.getElementById("run");
  runButton.addEventListener("click", () => evaluatePython(pyodide));
  await pyodide.loadPackage("numpy");
}

main();
