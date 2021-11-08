import * as Button from "./buttons";
export async function LandingScreen(reqPath: string) {
let formDivLocation = "formDiv";
let btnDivLocation = 'subFormDiv';
let nav = "saitweb-nav";

document.getElementById(formDivLocation).innerHTML=""; 
document.getElementById(btnDivLocation).innerHTML="";
document.getElementById('navDiv').innerHTML="";  
document.getElementById('headDiv').innerHTML="";
switch (reqPath){   
    case 'account':
        document.getElementById('headDiv').innerHTML="Accounts Management";
        //Button.navBtn('reports', 'View', btnDivLocation);
        Button.view(nav, 'customer', formDivLocation);
        //Button.navBtn('invoice', 'View', btnDivLocation);
        break;
    case 'admin':
        document.getElementById('headDiv').innerHTML="Administrative Management";
        Button.addCustomer(nav);
        Button.addType(nav);
        Button.addItem(nav);
        Button.addInvoice(nav);
        Button.addUser(nav);
        Button.view(nav, 'type', formDivLocation);
        Button.view(nav, 'item', formDivLocation);
        Button.view(nav, 'customer', formDivLocation);
        break;
    case 'inventory':
        document.getElementById('headDiv').innerHTML="Inventory Management";
        Button.addType(nav);
        Button.addItem(nav);
        Button.view(nav, 'type', formDivLocation);
        Button.view(nav, 'item', formDivLocation);
        break;
    case 'sales':
        document.getElementById('headDiv').innerHTML="Sales Management";
        Button.addCustomer(nav);
        //Button.navBtn('invoice', 'Add', btnDivLocation);
        Button.view(nav, 'customer', formDivLocation);
        //Button.navBtn('invoice', 'View', btnDivLocation);
        break;
    default:
        break;
}
btnDivLocation = 'navDiv';

/*
let lineBreak = document.createElement('br');
{
    document.getElementById(btnDivLocation).appendChild(lineBreak);
    Button.navBtn('Home', 'account', btnDivLocation);
    Button.navBtn('Home', 'admin', btnDivLocation);
    Button.navBtn('Home', 'inventory', btnDivLocation);
    Button.navBtn('Home', 'sales', btnDivLocation);
    */
} 
