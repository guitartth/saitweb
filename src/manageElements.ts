import { toNumber } from "lodash";
import * as CallAPI from "./callAPI";
import * as CreateElements from "./createElements";

export function isNumber(n:any) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); } 

export async function displayElements(data: any, location: string) {
    data.forEach(function (x: any) {
        document.getElementById(location).appendChild(x);
    })
}  

export async function setMainDivs(page: string, reqPath: string, formDivLocation: string, btnDivLocation: string, isModal?:boolean) {
    document.getElementById(formDivLocation).innerHTML=""; 
    document.getElementById(btnDivLocation).innerHTML="";
    if (isModal === undefined || !(isModal)) {
        document.getElementById('headDiv').innerHTML=page + " " + reqPath;
    }
    document.getElementById(btnDivLocation).classList.add('button-div');
    document.getElementById(formDivLocation).classList.add('form-div');
}

export async function setInvoiceCustomerInfo(formDivLocation:string, id:string) {
    let data = {ID: '', Name: '', Address: '', Phone: '', Email: ''};  
    let tax = 0;
    if (id != null || id != undefined) {
        let resData = await CallAPI.GET('customer', id);
        let taxData = await CallAPI.GET('tax', `Abbreviation=${resData[0].BillingState}`);
        let rate = 'Combined Tax Rate';
        tax = taxData[0]['Combined Tax Rate'];
        data.ID = resData[0]._id;
        data.Name = resData[0].Name;
        data.Address = resData[0].BillingAddress + ', ' + resData[0].BillingState + ' ' + resData[0].BillingZipcode; 
        data.Phone = resData[0].Phone;  
        data.Email = resData[0].Email; 
    }
    let keys = Object.keys(data);
    let vals = Object.values(data);
    keys.forEach(async function (x: any, index) {
        document.getElementById('Customer'+[x]).innerHTML=`${vals[index]}`;
    })
    document.getElementById('CustomerAddress').setAttribute('tax',`${tax}`);
    await setTotals();
    return data;
    }
export async function setInvoiceItemInfo(formDivLocation:string, position:number, id:string) {
    let newItemAdded = true;
    let resData = await CallAPI.GET('item', id);
    let adjustedQuantity: any = {"Quantity": `${(toNumber(resData[0].Quantity - 1))}`};
    await CallAPI.PUT('item', adjustedQuantity, id);
    let inputs = document.getElementsByName('itemID');
    if (inputs.length > 0) {
        inputs.forEach(async (x:any) => {
            if (id === x.innerHTML) {
                newItemAdded = false;
                console.log('value');
                (document.getElementById(x.innerHTML + '.Quantity') as HTMLInputElement).value = `${(toNumber((document.getElementById(x.innerHTML + '.Quantity') as HTMLInputElement).value) + 1)}`;
                (document.getElementById(x.innerHTML + '.Quantity') as HTMLInputElement).alt = `${(toNumber((document.getElementById(x.innerHTML + '.Quantity') as HTMLInputElement).value))}`;
                await setTotals();
            }
        });
    } 
    if (newItemAdded) {
        let ID = resData[0]._id;
        let Name = resData[0].Name;
        let Price = resData[0].Price;
        let Quantity = "1";
        let Description = '';
        delete resData[0]._id;
        delete resData[0].Name;
        delete resData[0].Price;
        delete resData[0].Cost;
        delete resData[0].Quantity;
        let keys = Object.keys(resData[0]);
        let vals = Object.values(resData[0]);
        keys.forEach(async function (x: any, index) {
                Description = Description + `${x}: ${vals[index]} `;
            })
        let Row = CreateElements.BaseElements('tr', ID + "Row");
        await displayElements(Row, formDivLocation);
        let IDField = CreateElements.BaseElements('td', ID + ".item");
        await displayElements(IDField, ID+"Row");
        document.getElementById(ID + ".item").setAttribute('name', 'itemID');
        document.getElementById(ID + ".item").innerHTML = ID;
        let NameField = CreateElements.BaseElements('td', ID + ".Name");
        await displayElements(NameField, ID+"Row");
        document.getElementById(ID + ".Name").innerHTML = Name;
        let DescriptionField = CreateElements.BaseElements('td', ID + ".Description");
        await displayElements(DescriptionField, ID+"Row");
        document.getElementById(ID + ".Description").innerHTML = Description;
        let PriceField = CreateElements.BaseElements('td', ID + ".Price");
        await displayElements(PriceField, ID+"Row");
        document.getElementById(ID + ".Price").innerHTML = Price;
        let QuantityField = CreateElements.BaseElements('td', ID + "Quantity");
        await displayElements(QuantityField, ID+"Row");
        let QuantityInput = CreateElements.BaseElements('input', ID + ".Quantity");
        await displayElements(QuantityInput, ID+"Quantity");
        (document.getElementById(ID + ".Quantity") as HTMLInputElement).value = Quantity;
        (document.getElementById(ID + ".Quantity") as HTMLInputElement).alt = Quantity;
        let TotalPriceField = CreateElements.BaseElements('td', ID + ".Total Price");
        await displayElements(TotalPriceField, ID+"Row");
        document.getElementById(ID + ".Total Price").innerHTML = `${priceTimesQuantity(toNumber(Price), toNumber(Quantity)).toFixed(2)}`;
        await setTotals();
    }
}

export function priceTimesQuantity(Price: number, Quantity: number) {
    return Price*Quantity;
}

export async function setTotals() {
    let subtotal = 0;
    let taxRate = document.getElementById('CustomerAddress').getAttribute('tax');
    let inputs = document.getElementsByName('itemID');
    if (inputs.length > 0) {
        inputs.forEach((x:any)  => {
            if (!(isNumber((document.getElementById(x.innerHTML + '.Quantity') as HTMLInputElement).value))) {
                (document.getElementById(x.innerHTML + '.Quantity') as HTMLInputElement).value = (document.getElementById(x.innerHTML + '.Quantity') as HTMLInputElement).alt;
                alert('Quantity must be a number');
            } else if (toNumber((document.getElementById(x.innerHTML + '.Quantity') as HTMLInputElement).value) === 0) {
                returnItems(x.innerHTML, toNumber((document.getElementById(x.innerHTML + '.Quantity') as HTMLInputElement).alt));
                document.getElementById('itemTable').removeChild(document.getElementById(x.innerHTML + 'Row'));
            } else if (toNumber((document.getElementById(x.innerHTML + '.Quantity') as HTMLInputElement).value) < 0){
                (document.getElementById(x.innerHTML + '.Quantity') as HTMLInputElement).value = (document.getElementById(x.innerHTML + '.Quantity') as HTMLInputElement).alt;
                alert('Quantity cannot be a negative number');
            } else {
                updateQuantity(x.innerHTML + '.Quantity', x.innerHTML);
                let itemTotal = toNumber(document.getElementById(x.innerHTML + '.Price').innerHTML) * toNumber((document.getElementById(x.innerHTML + '.Quantity') as HTMLInputElement).value);
                document.getElementById(x.innerHTML + '.Total Price').innerHTML = itemTotal.toFixed(2).toString();
                subtotal = subtotal + toNumber(itemTotal);
            }
        });
    }
    let tax = (Math.round(toNumber(taxRate) * subtotal *100)/100).toFixed(2);
    let total = subtotal + toNumber(tax);
    document.getElementById('SubTotal').innerHTML = `${subtotal.toFixed(2)}`;
    document.getElementById('Tax').innerHTML = `${tax}`;
    document.getElementById('Total').innerHTML = `${total.toFixed(2)}`;
}
export function phoneValidate(phone: string) {
    let phoneFormat = /([0-9]{3})[-]([0-9]{3})[-]([0-9]{4})$/;
    if (phone.match(phoneFormat)){
  	    return true; 
    }
    return false;
}

export async function returnItems(id: string, amount: number) {
    let resData = await CallAPI.GET('item', id);
    let finalValue: any = {Quantity: (toNumber(resData[0].Quantity) + amount).toString()};
    await CallAPI.PUT('item', finalValue , id);
}

export async function updateQuantity(inputLocation: string, id: string) {
    let resData = await CallAPI.GET('item', id);
    let altValue : number = toNumber((document.getElementById(inputLocation) as HTMLInputElement).alt);
    let valueValue : number = toNumber((document.getElementById(inputLocation) as HTMLInputElement).value);
    if (altValue != valueValue) {
        let finalValue: any = {Quantity: (toNumber(resData[0].Quantity) - valueValue + altValue).toString()};
        if (toNumber(finalValue.Quantity) < 0) {
            (document.getElementById(inputLocation) as HTMLInputElement).value = (document.getElementById(inputLocation) as HTMLInputElement).alt;
            alert(`not enough for the amount you have selected, there are only ${(toNumber(resData[0].Quantity))} ${resData[0].Name} left`);
            setTotals();
        } else {
            await CallAPI.PUT('item', finalValue , id);
            (document.getElementById(inputLocation) as HTMLInputElement).alt = (document.getElementById(inputLocation) as HTMLInputElement).value;
        }
    }
}
