console.log("hello from js");

// fetch a file "hello.py" and read the string, set it on tag
fetch("static/hello.py").then((response) => {
  response.text().then((text) => {
    console.log(text);
    // document.querySelector("#hello").innerText = text;
  });
});
