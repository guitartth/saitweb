
import * as Button from "./buttons";
import * as CreateElements from "./createElements";
import * as CallAPI from "./callAPI";
import * as ManageElements from "./manageElements"
import { createElementAccess } from "typescript";

const saltRounds = 10;
const formDivLocation = "formDiv";
const btnDivLocation = 'subFormDiv';
export async function AddType() {
  ManageElements.setMainDivs('Add','Type', formDivLocation, btnDivLocation);
  let requiredFields: any = CreateElements.RequiredFields('type');
  let fields = CreateElements.InputWithLabels(requiredFields, 'type-field');
  ManageElements.displayElements(fields, formDivLocation);
  Button.attribBtn(formDivLocation, btnDivLocation);
  Button.submitBtn('type', 'POST', formDivLocation, btnDivLocation);
}
export async function AddCustomer() {
  ManageElements.setMainDivs('Add', 'Customer', formDivLocation, btnDivLocation);
  let requiredFields: any = CreateElements.RequiredFields('customer');
  let fields = CreateElements.InputWithLabels(requiredFields, 'label-input-div');
  let flag = false;
  let additionalFields: any = {};
  //Display and remove elements
  ManageElements.displayElements(fields, formDivLocation);
  document.getElementById('Phone').setAttribute('type', "tel");
  document.getElementById('Phone').setAttribute('required', "true");
  document.getElementById('Phone').setAttribute('placeholder', "123-456-7890");
  document.getElementById('BillingState').remove();
  document.getElementById('ShippingState').remove();
  //create two dropdown fields
  let dropdownSS = await CreateElements.DropDown('ShippingState');
  await ManageElements.displayElements(dropdownSS, 'ShippingStateDiv');
  (document.getElementById('ShippingState') as HTMLSelectElement).value = '';
  let dropdownBS = await CreateElements.DropDown('BillingState');
  await ManageElements.displayElements(dropdownBS, 'BillingStateDiv');
  //get the data for the dropdowns and send to appropriate fields
  let resData: any = await CallAPI.GET('tax', null);
  let selectorOptions2 = CreateElements.DropOptions('Abbreviation', resData);
  await ManageElements.displayElements(selectorOptions2, 'ShippingState');
  let selectorOptions = CreateElements.DropOptions('Abbreviation', resData);
  await ManageElements.displayElements(selectorOptions, 'BillingState',);
  //create checkbox
  let checkBoxDiv = document.createElement('div');
  let checkLabel = CreateElements.Labels(['SameAsShipping']);
  let checkbox = CreateElements.Input('SameAsShipping');
  checkbox.setAttribute("value", 'false');
  checkbox.setAttribute("name", "SameAsShipping");
  checkBoxDiv.appendChild(checkLabel[0]);
  checkBoxDiv.appendChild(checkbox);
  checkBoxDiv.classList.add("label-input-div");
  let formDiv = document.getElementById(formDivLocation);
  let checkBoxLocation = document.getElementById("BillingAddressDiv");
  formDiv.insertBefore(checkBoxDiv, checkBoxLocation);
  document.getElementById('SameAsShipping').setAttribute('type', 'checkbox');
  //listen for checkbox same as shipping  
  document.getElementById('SameAsShipping').addEventListener('click', async (e:Event) =>{
    flag = await hideCustomerFields(flag);
  });
  //listen for billingstate dropdown set selected state value
  document.getElementById('BillingState').addEventListener('change', async (e:Event) => {
    e.preventDefault();
    let answer: HTMLSelectElement = document.querySelector("#BillingState");
    additionalFields = {...additionalFields, BillingState : answer.value};
    document.getElementById(btnDivLocation).removeChild(document.getElementById('Submit'));
    Button.customerSubmitBtn('customer', 'POST', formDivLocation, btnDivLocation, additionalFields); 
  }); 
  //listen for shippingstate dropdown set selected state value
  document.getElementById('ShippingState').addEventListener('change', async (e:Event) => {
    e.preventDefault();
    let answer: HTMLSelectElement = document.querySelector("#ShippingState");

    additionalFields = {...additionalFields, ShippingState : answer.value};
    document.getElementById(btnDivLocation).removeChild(document.getElementById('Submit'));
    Button.customerSubmitBtn('customer', 'POST', formDivLocation, btnDivLocation, additionalFields); 
  }); 
  Button.customerSubmitBtn('customer', 'POST', formDivLocation, btnDivLocation);
}
async function hideCustomerFields(flag: boolean){
  flag = !flag;
  document.getElementById('SameAsShipping').setAttribute("value", `${flag}`);
  //hide if true; unhide if false
  document.getElementById('BillingAddressField').toggleAttribute("hidden", flag);
  document.getElementById('BillingAddress').toggleAttribute("hidden", flag);
  document.getElementById('BillingStateField').toggleAttribute("hidden", flag);
  document.getElementById('BillingState').toggleAttribute("hidden", flag);
  document.getElementById('BillingZipcodeField').toggleAttribute("hidden", flag);
  document.getElementById('BillingZipcode').toggleAttribute("hidden", flag);
  return flag;
}
export async function AddItem() {
  let additionalFields: any = {};
  ManageElements.setMainDivs('Add', 'Item', formDivLocation, btnDivLocation);
  let requiredFields: any = CreateElements.RequiredFields('item');
  let fields = await CreateElements.InputWithLabels(requiredFields, 'add-item-input-div');
  await ManageElements.displayElements(fields, formDivLocation);
  document.getElementById('Type').remove();
  let selector = await CreateElements.DropDown('Type');
  await ManageElements.displayElements(selector, 'TypeDiv');
  let resData: any = await CallAPI.GET('type', null);
  let selectorOptions = await CreateElements.DropOptions('Type', resData);
  await ManageElements.displayElements(selectorOptions, 'Type');
  let div = await CreateElements.BaseElements('div', 'attribsDiv');
  await ManageElements.displayElements(div, formDivLocation);
  document.getElementById('Type').addEventListener('change', async (e:Event) => {
    e.preventDefault();
    let answer: HTMLInputElement = (document.querySelector("#Type"));
    additionalFields = {Type : answer.value};
    let resData: any = await CallAPI.GET('type', 'Type='+ answer.value);
    let resKeys = Object.keys(resData[0]);
    let count = resKeys.length;
    document.getElementById('attribsDiv').innerHTML="";
    let fields = [];
    for (let i = 2; i < count; i++) {
      fields.push(`${[resData[0][resKeys[i]]]}`);
    }
    fields = CreateElements.InputWithLabels(fields, 'add-item-input-div');
    await ManageElements.displayElements(fields, 'attribsDiv'); 
    document.getElementById(btnDivLocation).removeChild(document.getElementById('Submit'));
    Button.submitBtn('item', 'POST', formDivLocation, btnDivLocation, additionalFields);
  });
  Button.submitBtn('item', 'POST', formDivLocation, btnDivLocation);
}
export async function AddUser() {
  ManageElements.setMainDivs('Add','User', formDivLocation, btnDivLocation);
  let requiredFields: any = CreateElements.RequiredFields('user');
  let fields = CreateElements.InputWithLabels(requiredFields, 'label-input-div');
  let additionalFields: any = {};
  await ManageElements.displayElements(fields, formDivLocation);
  document.getElementById('Password').setAttribute('type', 'password');
  document.getElementById('DefaultRole').remove();
  document.getElementById('Roles').remove();
  //create drop down
  let dropdownDF = await CreateElements.DropDown('DefaultRole');
  await ManageElements.displayElements(dropdownDF, 'DefaultRoleDiv');
  //get the roles from db assign them to divs
  let resData: any = await CallAPI.GET('roles', null);
  (document.getElementById('DefaultRole') as HTMLSelectElement).value = '';
  let selectorOptions = CreateElements.DropOptions('role', resData);
  await ManageElements.displayElements(selectorOptions, 'DefaultRole');
  //create checkboxes
  let checkBoxDiv = document.createElement('div');
  let checkLabel: any = [];
  let checkbox: HTMLInputElement;
  let checkOptions = CreateElements.DropOptions('role', resData);
  checkOptions.shift();
  for(let i = 0; i < checkOptions.length; i++){
    checkLabel = (CreateElements.PlainLabels([checkOptions[i].textContent]));
    checkbox = (CreateElements.Input(checkOptions[i].textContent));
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('name', 'Roles');
    checkbox.textContent = checkOptions[i].textContent;
    checkBoxDiv.appendChild(checkbox);
    checkBoxDiv.appendChild(checkLabel[0]);
  }
  checkBoxDiv.classList.add("Roles");
  let formDiv = document.getElementById(formDivLocation);
  let checkBoxLocation = document.getElementById("Roles");
  formDiv.insertBefore(checkBoxDiv, checkBoxLocation);
  //listener for default role
  document.getElementById('DefaultRole').addEventListener('change', async (e:Event) => {
    e.preventDefault();
    let roles = document.getElementsByName('Roles');
    for(let i = 0; i < roles.length; i++){
      (roles[i]  as HTMLInputElement).disabled = false;
    }
    let answer: HTMLSelectElement = document.querySelector("#DefaultRole");
    additionalFields.DefaultRole = answer.value;
    (document.getElementById(answer.value) as HTMLInputElement).disabled = true;
    (document.getElementById(answer.value)as HTMLInputElement).checked = true;
    document.getElementById(btnDivLocation).removeChild(document.getElementById('Submit'));
    Button.userSubmitBtn('user', 'POST', formDivLocation, btnDivLocation, additionalFields); 
  }); 
  Button.userSubmitBtn('user', 'POST', formDivLocation, btnDivLocation, additionalFields);
}
export async function AddInvoice() {
  ManageElements.setMainDivs('Add', 'Invoice', formDivLocation, btnDivLocation);
  let modalDivLocation = 'modalBody';
  let modalBtnDivLocation = 'modalBtns';
  let firstRowDivLocation = "formdivRow1";
  let thirdRowDivLocation = "formdivRow3";
  let modalbody = CreateElements.BaseElements('div', modalDivLocation);
  let modalbtns = CreateElements.BaseElements('div', modalBtnDivLocation);
  await ManageElements.displayElements(modalbody, 'modalDiv');
  await ManageElements.displayElements(modalbtns, 'modalDiv');
  let firstRowDiv = CreateElements.BaseElements('div', firstRowDivLocation);
  firstRowDiv[0].classList.add("row-div");
  await ManageElements.displayElements(firstRowDiv, formDivLocation);
  let customerDiv = CreateElements.BaseElements('div', 'customerDiv');
  customerDiv[0].classList.add("customerDiv");  
  await ManageElements.displayElements(customerDiv, firstRowDivLocation);
  let custIDLabel = CreateElements.Labels(['CustomerID']);
  let custNameLabel = CreateElements.Labels(['CustomerName']);
  let custAddressLabel = CreateElements.Labels(['CustomerAddress']);
  let custPhoneLabel = CreateElements.Labels(['CustomerPhone']);
  let custEmailLabel = CreateElements.Labels(['CustomerEmail']);
  let custIDField = CreateElements.BaseElements('text', 'CustomerID');
  let custNameField = CreateElements.BaseElements('text', 'CustomerName');
  let custAddressField = CreateElements.BaseElements('text', 'CustomerAddress');
  let custPhoneField = CreateElements.BaseElements('text', 'CustomerPhone');
  let custEmailField = CreateElements.BaseElements('text', 'CustomerEmail');
  await ManageElements.displayElements(custIDLabel, 'customerDiv');
  await ManageElements.displayElements(custIDField, 'customerDiv');
  await ManageElements.displayElements(custNameLabel, 'customerDiv');
  await ManageElements.displayElements(custNameField, 'customerDiv');
  await ManageElements.displayElements(custAddressLabel, 'customerDiv');
  await ManageElements.displayElements(custAddressField, 'customerDiv');
  await ManageElements.displayElements(custPhoneLabel, 'customerDiv');
  await ManageElements.displayElements(custPhoneField, 'customerDiv');
  await ManageElements.displayElements(custEmailLabel, 'customerDiv');
  await ManageElements.displayElements(custEmailField, 'customerDiv');
  Button.selectorBtn('customer', firstRowDivLocation, modalDivLocation, modalBtnDivLocation, "add-button");
  document.getElementById('addcustomer').addEventListener("click", event => {
    document.getElementById("modalDiv").style.display = "block"
  });
  let statusDiv = CreateElements.BaseElements('div', 'statusDiv');
  await ManageElements.displayElements(statusDiv, 'formdivRow1' );
  let statusLabel = CreateElements.Labels(['Status']);
  await ManageElements.displayElements(statusLabel, 'statusDiv');
  let statusSelect = CreateElements.BaseElements('select','Status');
  await ManageElements.displayElements(statusSelect, 'statusDiv');
  let statusOpen = (document.createElement('option') as HTMLOptionElement);
  let statusPaid = (document.createElement('option') as HTMLOptionElement);
  statusOpen.innerHTML = 'Open';
  statusPaid.innerHTML = 'Paid';
  document.getElementById('Status').appendChild(statusOpen);
  document.getElementById('Status').appendChild(statusPaid);
  let itemDiv = CreateElements.BaseElements('div', 'itemDiv');
  itemDiv[0].classList.add("row-div"); 
  await ManageElements.displayElements(itemDiv, formDivLocation);
  let itemTable = CreateElements.BaseElements('table', 'itemTable');
  await ManageElements.displayElements(itemTable, 'itemDiv');
  document.getElementById('itemTable').setAttribute('border', '1');
  let tableHeadRow = CreateElements.BaseElements('tr', 'tableHeadRow');
  await ManageElements.displayElements(tableHeadRow, 'itemTable');
  let headTableColums = ['Item Id', 'Item', 'Description', 'Price', 'Quantity', 'Total Price'];
  headTableColums.forEach(async function (itemx:string) {
    let headTableCell = CreateElements.BaseElements('th', 'item'+itemx);
    await ManageElements.displayElements(headTableCell, 'tableHeadRow');
    document.getElementById('item'+itemx).innerHTML=itemx;
  });
  let thirdRowDiv= CreateElements.BaseElements('div', thirdRowDivLocation);
  await ManageElements.displayElements(thirdRowDiv, formDivLocation); 
  thirdRowDiv[0].classList.add('row-div');  
  Button.selectorBtn('item', thirdRowDivLocation, modalDivLocation, modalBtnDivLocation, "add-button");
  document.getElementById('additem').addEventListener("click", event => {document.getElementById("modalDiv").style.display = "block"});
  let updateQuantityDiv = CreateElements.BaseElements('div', 'updateQuantityDiv');
  await ManageElements.displayElements(updateQuantityDiv, thirdRowDivLocation);
  let totalsDiv = CreateElements.BaseElements('div', 'totalsDiv');
  await ManageElements.displayElements(totalsDiv, thirdRowDivLocation);
  let subtotalDiv = CreateElements.BaseElements('div', 'subtotalDiv');
  await ManageElements.displayElements(subtotalDiv,'totalsDiv');
  let taxDiv = CreateElements.BaseElements('div', 'taxDiv');
  await ManageElements.displayElements(taxDiv,'totalsDiv');
  let totalDiv = CreateElements.BaseElements('div', 'totalDiv');
  await ManageElements.displayElements(totalDiv,'totalsDiv');
  let subTotalLabel = CreateElements.Labels(['SubTotal']);
  let TaxLabel = CreateElements.Labels(['Tax']);
  let TotalLabel = CreateElements.Labels(['Total']);
  let subTotalField = CreateElements.BaseElements('text', 'SubTotal');
  let TaxField = CreateElements.BaseElements('text', 'Tax');
  let TotalField = CreateElements.BaseElements('text', 'Total');
  await ManageElements.displayElements(subTotalLabel, 'subtotalDiv');
  await ManageElements.displayElements(subTotalField, 'subtotalDiv');
  await ManageElements.displayElements(TaxLabel, 'taxDiv');
  await ManageElements.displayElements(TaxField, 'taxDiv');
  await ManageElements.displayElements(TotalLabel, 'totalDiv');
  await ManageElements.displayElements(TotalField, 'totalDiv');
  await ManageElements.setInvoiceCustomerInfo('customerDiv', null);
  Button.invoiceSubmitBtn('invoice','POST', formDivLocation , btnDivLocation);
  Button.updateQuantityBtn('updateQuantityDiv');
}
