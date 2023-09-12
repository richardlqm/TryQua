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
  let code = document.querySelector("code.language-python");
  // trim and set the response
  response.text().then((text) => {
    code.textContent = escapeHtml(text.trim());
    hljs.highlightBlock(code);
  });
  // on change, type or modify rehighlight
  const listeners = ["input", "change"];
  listeners.forEach((listener) => {
    // get selection, keep it and set it after
    code?.addEventListener(listener, (e) => {
      // re highlight and set selection back
      const selectionStart = window.getSelection().getRangeAt(0).startOffset;
      // hljs.highlightElement(code);
      // A bug with the cursor jumping always to the beginning blocks me
      // console.log(selectionStart);
      // hljs.highlightBlock(code);
      // window.getSelection().getRangeAt(0).setStart(code, selectionStart);
    });
  });
});
