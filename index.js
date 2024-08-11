// //fs=fileSystem
const fs = require("fs"); //we get access to function to reading or writing data
const http = require("http"); //modules in nodejs Package
// //the readFileSync takes two arguments
// //1st is the file path and second is the character encoding
// //Blocking/Synchronous way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `This is what we know aout the avocado: ${textIn}.\nCreated on${Date.now()}`;
// //specifying where to save the file
// //second is the variable that contains value which is saved in output.txt
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("file written");

//Non blocking asynchronous way
//2nd argument is callBack function which is called after running succefully
fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
  if (err) {
    return console.log("ERROR");
  }
  fs.readFile(`./txt/${data}.txt`, "utf-8", (err, data2) => {
    fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
      console.log(data3);
      fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
        console.log("your file has been written");
      });
    });
  });
});
console.log("Will read the file");

//////////////////////////////////////////////////////////////
