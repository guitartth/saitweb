import * as CallAPI from "./callAPI";
import * as View from "./viewScreen";
import * as Add from "./addScreen";
import * as Landing from "./landingScreen";
import * as ManageElements from "./manageElements";

export async function attribBtn(formDivLocation: string, btnDivLocation: string){
    let addAttribButton = document.createElement("button");
    addAttribButton.innerHTML = "Add Attribute";
    addAttribButton.classList.add('attribute-button');
    document.getElementById(btnDivLocation).appendChild(addAttribButton);
    let count =1;
    addAttribButton.addEventListener("click", (e:Event) => {
        let attributeDiv = document.createElement('div');
        attributeDiv.classList.add('attribute-input-div');
        let attribLabel = document.createElement('label');
        attribLabel.setAttribute("for", "Attribute" + count);
        attribLabel.innerHTML = "Attribute" + " " + count + ":  ";
        attribLabel.setAttribute("id", "AttributeLabel" + count);
        let attribField = document.createElement('input'); 
        attribField.setAttribute("id", "Attribute" + count);

        attributeDiv.appendChild(attribLabel);
        attributeDiv.appendChild(attribField);
        document.getElementById(formDivLocation).appendChild(attributeDiv);
        count += 1; 
    });
}
export async function loginBtn(formDivLocation: string, btDivLocation: string) {
    
    let submitButton = document.createElement("button");
    submitButton.innerHTML = "Submit";
    submitButton.classList.add("submit-button");
    document.getElementById(btDivLocation).appendChild(submitButton);
    submitButton.addEventListener("click", async (e:Event) => {
        e.preventDefault();
        let shouldSubmit = true;
        
        let data: any = {};
        let inputValues: any[] = [];
        let inputTypys = document.getElementById(formDivLocation).querySelectorAll('input');
        inputTypys.forEach(input => {
            if (input.value === ""){
                // shouldSubmit = false;
            }
            inputValues.push({Field : input.id, Value :input.value });
            data = inputValues.reduce((acc, { Field, Value }) => ({ ...acc, [Field]: Value }), {});
        });
        if (shouldSubmit) {
        //     let result = await CallAPI.POST('login', data);
        //     console.log(result);
        //     if (result[0] === 'success') {
                Landing.LandingScreen('admin');
        //     } else {
        //         alert(result[0]);
        //     }
        // } else {
        //     alert("Please complete all fields.");
        }
    });
}
export async function addType(btnDivLocation: string){
    let navButton = document.createElement("button");
    navButton.innerHTML = 'Add Type';
    document.getElementById(btnDivLocation).appendChild(navButton);
    navButton.addEventListener("click", (e:Event) => {
        Add.AddType();
    });
}
export async function view(btnLocation: string, reqPath: string, formDivLocation: string){
    let navButton = document.createElement("button");
    navButton.innerHTML = 'view '+reqPath;
    document.getElementById(btnLocation).appendChild(navButton);
    navButton.addEventListener("click", (e:Event) => {
        View.selectView(reqPath, formDivLocation, "subFormDiv", false);
    });
}
export async function addItem(btnDivLocation: string){
    let navButton = document.createElement("button");
    navButton.innerHTML = 'Add Item';
    document.getElementById(btnDivLocation).appendChild(navButton);
    navButton.addEventListener("click", (e:Event) => {
        Add.AddItem();
    });
}
export async function addInvoice(btnDivLocation: string){
    let navButton = document.createElement("button");
    navButton.innerHTML = 'Add invoice';
    document.getElementById(btnDivLocation).appendChild(navButton);
    navButton.addEventListener("click", (e:Event) => {
        Add.AddInvoice();
    });
}
export async function addUser(btnDivLocation: string){
    let navButton = document.createElement("button");
    navButton.innerHTML = 'Add User';
    document.getElementById(btnDivLocation).appendChild(navButton);
    navButton.addEventListener("click", (e:Event) => {
        Add.AddUser();
    });
}
export async function addCustomer(btnDivLocation: string){
    let navButton = document.createElement("button");
    navButton.innerHTML = 'Add Customer';
    document.getElementById(btnDivLocation).appendChild(navButton);
    navButton.addEventListener("click", (e:Event) => {
        Add.AddCustomer();
    });
}
export async function submitBtn(reqPath: string, transMethod: string, formDivLocation: string, btDivLocation: string, additionalFields?: any) {
    let submitButton = document.createElement("button");
    submitButton.setAttribute('id', "Submit");
    submitButton.classList.add("submit-button");
    submitButton.innerHTML = "Submit";
    document.getElementById(btDivLocation).appendChild(submitButton);
    submitButton.addEventListener("click", async (e:Event) => {
        e.preventDefault();
        processSubmit(reqPath, transMethod, formDivLocation, additionalFields);
    });
}
export async function userSubmitBtn(reqPath: string, transMethod: string, formDivLocation: string, btDivLocation: string, additionalFields?: any) {
    let submitButton = document.createElement("button");
    submitButton.setAttribute('id', "Submit");
    submitButton.classList.add("submit-button");
    submitButton.innerHTML = "Submit";
    document.getElementById(btDivLocation).appendChild(submitButton);
    submitButton.addEventListener("click", async (e:Event) => {
        e.preventDefault();
        let roles = document.getElementsByName('Roles');
        for(let i = 0; i < roles.length; i++){
          (roles[i]  as HTMLInputElement).value = ((roles[i]  as HTMLInputElement).checked).toString();
        }
        processSubmit(reqPath, transMethod, formDivLocation, additionalFields);
    });
}
async function processSubmit(reqPath: string, transMethod: string, formDivLocation: string, additionalFields?: any){
    let shouldSubmit = true;
    let inputValues: any[] = [];
    let data: any = {};
    let selectTypes = document.getElementById(formDivLocation).querySelectorAll('select');
    if (selectTypes.length > 0) {
        selectTypes.forEach(select => {
            if (select.value === ""){
                    shouldSubmit = false;
            }
        });
    }
    let inputTypys = document.getElementById(formDivLocation).querySelectorAll('input');
    inputTypys.forEach(input => {
        if (input.value === ""){
                shouldSubmit = false;
        }  
        inputValues.push({Field : input.id, Value :input.value });
        data = inputValues.reduce((acc, { Field, Value }) => ({ ...acc, [Field]: Value }), {});

        if (additionalFields != undefined && additionalFields != null) {
            let keys = Object.keys(additionalFields);
            keys.forEach(x => {
                data = {...data, [x] : additionalFields[x]};
            });
        }
    });
    if (shouldSubmit){
        //check if updating "put" or new. 
        //if new check if record already exists, if it does, throw messsage saying iteam 
        //already exists, and do not write it.
        if (transMethod === 'POST') {
            CallAPI.POST(reqPath, data);
            alert('submitted');
        } else {
            let id = data["_id"];
            delete data["_id"];
            //CallAPI.PUT(reqPath, data, id);
        }
    } else {
        alert("Please complete all fields.");
    }
}
export async function customerSubmitBtn(reqPath: string, transMethod: string, formDivLocation: string, btDivLocation: string, additionalFields?: any) {
    let submitButton = document.createElement("button");
    submitButton.setAttribute("id", 'Submit');
    submitButton.innerHTML = "Submit";
    submitButton.classList.add("submit-button");
    document.getElementById(btDivLocation).appendChild(submitButton);

    submitButton.addEventListener("click", async (e:Event) => {
        e.preventDefault();
        if ((document.getElementById('ShippingState') as HTMLSelectElement).value == "") {
            alert("Please complete all fields.");
        } else {
            if((document.getElementById('SameAsShipping')as HTMLInputElement).checked){
                let ans: HTMLInputElement = (document.querySelector("#ShippingAddress"));
                (document.getElementById('BillingAddress') as HTMLInputElement).value = ans.value;
                (document.getElementById('BillingState') as HTMLSelectElement).value = (document.getElementById('ShippingState') as HTMLSelectElement).value;
                additionalFields = {...additionalFields, BillingState: additionalFields.ShippingState}
                let ans1: HTMLInputElement = (document.querySelector("#ShippingZipcode"));
                (document.getElementById('BillingZipcode') as HTMLInputElement).value = ans1.value;
            }
            // Validates phone number format before allowing submit
            if(ManageElements.phoneValidate((document.getElementById('Phone') as HTMLSelectElement).value))
            {
                await processSubmit(reqPath, transMethod, formDivLocation, additionalFields);
            }
            else{
                alert("Please enter phone number as 123-456-7890.");
            }
        }
    });
}

// Element is div location button gets added to. reqPath is where it takes the user.
export async function backBtn(reqPath: string, formDivLocation:string, btnDivLocation:string){ 
    let button = document.createElement("button");
    button.innerHTML = "Back";
    document.querySelector("#formDiv").appendChild(button);

    button.addEventListener("click", async (e:Event) => {
        View.selectView(reqPath, formDivLocation, btnDivLocation, true);
    });
}

export async function editBtn(reqPath: string){
    let formDiv = document.querySelector("#formDiv");
        let editButton = document.createElement("button");
        editButton.innerHTML = "Edit";
        formDiv.appendChild(editButton);
         
         // Enables all the input blanks but type and id. Swaps edit button for submit button that posts the information the user enters into the inputs.
        editButton.addEventListener("click", async (e:Event) => {
        let InputElements = formDiv.children;

        for (let i = 0; i < InputElements.length; i++){ 
            if (InputElements[i].id !== "_id" && InputElements[i].id !== "Type"){
                let EM = <HTMLInputElement>InputElements[i];
                EM.disabled = false;
            }
        }
        editButton.remove();
        submitBtn(reqPath, "PUT", formDiv.id, formDiv.id);
    });  
}

export async function selectBtn(reqPath: string,  id: string, btnDivLocation: string, formDivLocation: string, cssClass?: string) {
    let selectButton = document.createElement("button");
    selectButton.innerHTML = "Select";
    if (cssClass != undefined)
    {
        selectButton.classList.add(cssClass);
    }    
    document.getElementById(id).appendChild(selectButton);
    selectButton.addEventListener("click", async (e:Event) => {
        View.ViewScreen(reqPath, formDivLocation, btnDivLocation, id);
    });
}
export async function clearBtn(reqPath: string, formDivLocation :string, btnDivLocation: string, isModal: boolean) {
    if (isModal) {
        btnDivLocation ='modalBtns'
    }
    let clearButton = document.createElement("button");
    clearButton.innerHTML = "Clear All";
    clearButton.classList.add('clear-button');
    document.getElementById(btnDivLocation).appendChild(clearButton);
    clearButton.addEventListener("click", async (e:Event) => {
        View.selectView(reqPath, formDivLocation, btnDivLocation, isModal);
    });
}
export async function modalSelectBtn(reqPath: string, btnLocation: string, id: string, formDivLocation :string, btnDivLocation: string,  cssClass?: string) {
    let selectButton = document.createElement("button");
    selectButton.innerHTML = "Select";
    if (cssClass != undefined)
    {
        selectButton.classList.add(cssClass);
    }    
    document.getElementById(btnLocation).appendChild(selectButton);
    selectButton.addEventListener("click", async (e:Event) => {
        ManageElements.setMainDivs('Add', reqPath, formDivLocation, btnDivLocation, true);
        if (reqPath === 'customer') {
            await ManageElements.setInvoiceCustomerInfo(reqPath + 'Div', id);
        }
        if (reqPath === 'item') {
            await ManageElements.setInvoiceItemInfo('itemTable',1, id);
        }
        document.getElementById("modalDiv").style.display = "none";     
    });
}
export async function selectorBtn(reqPath: string, btnDivLocation: string, modalDivLocation :string, modalBtnDivLocation: string, cssClass?: string) {
    let selectButton = document.createElement("button");
    selectButton.setAttribute('id', "add" + reqPath);
    selectButton.innerHTML = "Add " + reqPath;
    if (cssClass != undefined)
    {
        selectButton.classList.add(cssClass);
    }
    document.getElementById(btnDivLocation).appendChild(selectButton);
    selectButton.addEventListener("click", async (e:Event) => {
        View.selectView(reqPath, modalDivLocation, modalBtnDivLocation, true);
    });
}
export async function addInvoiceItemBtn(formDivLocation: string, btnDivLocation: string, id: string){
    let addInvoiceItemButton = document.createElement("button");
    addInvoiceItemButton.innerHTML = "Add Item";
    document.getElementById(btnDivLocation).appendChild(addInvoiceItemButton);
    let count =1;
    addInvoiceItemButton.addEventListener("click", async function (e:Event) {
        await ManageElements.setInvoiceItemInfo('itemTable', count, id);
        count += 1; 
    });
}
export async function invoiceSubmitBtn(reqPath: string, transMethod: string, formDivLocation: string, btDivLocation: string, additionalFields?: any) {
    let submitButton = document.createElement("button");
    submitButton.setAttribute('id', "Submit");
    submitButton.classList.add("submit-button");
    submitButton.innerHTML = "Submit";
    document.getElementById(btDivLocation).appendChild(submitButton);
    submitButton.addEventListener("click", async (e:Event) => {
        e.preventDefault();
        let shouldSubmit = true;
        let data: any = {};
        let custData: any = {};
        let totalsData: any = {};
        let itemData: any = {};
        let inputValues: any[] = [];
        let customerFields = document.getElementById('customerDiv').querySelectorAll('text');
        customerFields.forEach((text) => {
            if (text.innerHTML === ''){
                shouldSubmit = false;
            }  
        inputValues.push({Field : text.id, Value :text.innerHTML });
        custData = inputValues.reduce((acc, { Field, Value }) => ({ ...acc, [Field]: Value }), {});
        });
        inputValues = [];
        let totalsFields = document.getElementById('totalsDiv').querySelectorAll('text');
        totalsFields.forEach((text) => {
            if (text.innerHTML === ''){
                shouldSubmit = false;
            }  
        inputValues.push({Field : text.id, Value :text.innerHTML });
        totalsData = inputValues.reduce((acc, { Field, Value }) => ({ ...acc, [Field]: Value }), {});
        });
        let itemFields = document.getElementsByName('itemID');
        if (itemFields == null || itemFields == undefined) {
            shouldSubmit = false;
        } else {
            itemFields.forEach(async(td) => {
                let id = td.innerHTML;
                itemData = {...itemData, [id]: {Name: document.getElementById(id + '.Name').innerHTML, 
                            Description: document.getElementById(id + '.Description').innerHTML, 
                            Price: document.getElementById(id + '.Price').innerHTML,
                            Quantity: document.getElementById(id + '.Quantity').innerHTML,
                            TotalPrice: document.getElementById(id + '.Total Price').innerHTML
                }};
            });
        }
        let fullDate: Date = new Date();
        let invoiceDate = fullDate.getMonth() + '/' + fullDate.getDay() + '/' + fullDate.getFullYear();
        let paidDate = '';
        if ((document.getElementById('Status') as HTMLSelectElement).value === 'Paid') {
            paidDate = invoiceDate;
        }
        data = {customer : custData , totals : totalsData, items : itemData, status: (document.getElementById('Status') as HTMLSelectElement).value, invoiceDate : invoiceDate, paidDate : paidDate};
        if (shouldSubmit) {
            CallAPI.POST('invoice', data);
            alert('Submitted');
        } else {
            alert('Please complete all the fields');
        }
    });
}
export async function updateQuantityBtn(btnDivLocation: string){
    let updateQuantityButton = document.createElement("button");
    updateQuantityButton.innerHTML = "Update Quantitiy";
    document.getElementById(btnDivLocation).appendChild(updateQuantityButton);
    updateQuantityButton.addEventListener("click", async (e:Event) => {
        e.preventDefault();
        ManageElements.setTotals();
    });
}