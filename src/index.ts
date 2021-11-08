import _ from 'lodash';
import * as Button from "./buttons";

let formDivLocation = "formDiv";
let btnDivLocation = 'subFormDiv';
let headDiv = document.createElement('div');
headDiv.setAttribute("id", "headDiv");
headDiv.innerHTML="Welcome to SAIT";
document.body.appendChild(headDiv);
let formDiv = document.createElement('div');
;
formDiv.setAttribute("id", "formDiv");
document.body.appendChild(formDiv);
let subFormDiv = document.createElement('div');
subFormDiv.setAttribute("id", "subFormDiv");
document.body.appendChild(subFormDiv);
let navDiv = document.createElement('div');
navDiv.setAttribute("id", "navDiv");
document.body.appendChild(navDiv);

let IDLabel = document.createElement('label');
IDLabel.setAttribute("for", "IDField");
IDLabel.innerHTML = "ID" + ":  ";
IDLabel.setAttribute("id", "ID");
let IDField = document.createElement('input'); 
IDField.classList.add("ID-field");
IDField.setAttribute("id", "ID");
IDField.setAttribute("value", "");
let linebreak = document.createElement('br');
document.getElementById(formDivLocation).appendChild(IDLabel);  
document.getElementById(formDivLocation).appendChild(IDField);
document.getElementById(formDivLocation).appendChild(linebreak);

let passwordLabel = document.createElement('label');
passwordLabel.setAttribute("for", "passwordField");
passwordLabel.innerHTML = "password" + ":  ";
passwordLabel.setAttribute("id", "password");
let passwordField = document.createElement('input'); 
passwordField.setAttribute("id", "Password");
passwordField.setAttribute("type", "password");
passwordField.setAttribute("value", "");
document.getElementById(formDivLocation).appendChild(passwordLabel);  
document.getElementById(formDivLocation).appendChild(passwordField);

Button.loginBtn(formDivLocation, btnDivLocation);

let modalDiv = document.createElement('div');
modalDiv.setAttribute("id", "modalDiv");
modalDiv.innerHTML="";
document.body.appendChild(modalDiv);
window.addEventListener("click", event => {
  if(event.target == document.getElementById("modalDiv"))
  {
    document.getElementById("modalDiv").style.display = "none";
  }
});