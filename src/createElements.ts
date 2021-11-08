import { toLower, toUpper } from "lodash";
import { stringify } from "querystring";


export async function DropDown(selectedKey: string) {
    let queryKeyselector = document.createElement('select');
    queryKeyselector.setAttribute("id", selectedKey);
    let result: any[] = [];
    result.push(queryKeyselector);
    return result;
}

export function DropOptions(selectedKey:string, data: any) {
    let options:any = [];
    let resData: HTMLElement[] = [];
    let count = data.length
    for (let i = 0; i < count; i++) {
        let result = data[i];
        options.push(result[selectedKey]);;
    };
    const useFilter:any = (arr: any[]) => {
        return arr.filter((value:any, index:any, self:any) => {
            return self.indexOf(value) === index;
        });
        };
    const result = useFilter(options);  
    count = result.length;
    if (count > 1) {
        let keyOption = document.createElement('option');
        keyOption.innerHTML = "";
        keyOption.setAttribute('value', "");
        keyOption.setAttribute('hidden', 'true');
        resData.push(keyOption);
    }
    for (let i = 0; i < count; i++) {
        let keyOption = document.createElement('option');
        keyOption.innerHTML = result[i];
        keyOption.setAttribute('value', result[i]);
        resData.push(keyOption);
    };
    return resData;
    
}

export function BaseElements(elementType: string, elementID: string) {
    let resData: any[] = [];
        let element = document.createElement(elementType);
        element.setAttribute("id", elementID);
        element.innerHTML ='';
        resData.push(element);
    return resData;
}

export function Input(elementID: string) {
        let element: HTMLInputElement = document.createElement('input');
        element.setAttribute("id", elementID);
    return element;
}
export function InputWithLabels(fields: any[], cssClass?: string) {
    let resData: any[] = [];
    let count = fields.length;
    for (let i = 0; i < count; i++) {
        let containerDiv = document.createElement('div');
        containerDiv.setAttribute("id", fields[i] + "Div");
        if (cssClass != undefined){
            containerDiv.classList.add(cssClass);
        }  
        let labelField = document.createElement('label');
        labelField.setAttribute("id", fields[i] + "Field");
        // labelField.innerHTML = " " + fields[i] + ":  ";
        // labelField.setAttribute("for", fields[i]);
        // resData.push(labelField);
        labelField.innerHTML = putSpaceBetweenWords(fields[i]) + ":  ";
        let inputField = document.createElement('input'); 
        inputField.setAttribute("id", fields[i]);
        // resData.push(inputField);
        containerDiv.appendChild(labelField);
        containerDiv.appendChild(inputField);
        resData.push(containerDiv);
    }
    return resData;
}
export function Labels(fields: any[]) {
    let resData: any[] = [];
    let count = fields.length;
    for (let i = 0; i < count; i++) {
        let labelField = document.createElement('label');
        labelField.setAttribute("for", fields[i]);
        labelField.innerHTML = putSpaceBetweenWords(fields[i]) + ":  ";
        resData.push(labelField);
    }
    return resData;
}
export function PlainLabels(fields: any[]) {
    let resData: any[] = [];
    let count = fields.length;
    for (let i = 0; i < count; i++) {
        let labelField = document.createElement('label');
        labelField.setAttribute("for", fields[i]);
        labelField.innerHTML = putSpaceBetweenWords(fields[i]);
        resData.push(labelField);
    }
    return resData;
}
export function RequiredFields(reqPath: string) {
    switch (reqPath) {
        case 'type':
          return ['Type'];
          break;
        case 'item':
          return ['Name', 'Cost', 'Price', 'Quantity', 'Type']; ////Type, MUST be last, add screen will pop it 
          break;
        case 'item2': // Testing grounds (again), this gotta go at some point. 
          return ['_id', 'Quantity'];
          break;
        case 'invoice':
          return [];
          break;
        case 'customer':
          return ['Name', 'ShippingAddress', 'ShippingState', 'ShippingZipcode', 'Email', 'Phone', 'BillingAddress', 'BillingState', 'BillingZipcode'];
          break;
        case 'user':
          return ['Name', 'LoginId', 'Password' , 'DefaultRole', 'Roles'];
          break;
    }
}

function putSpaceBetweenWords(words: string)
{
    let newString = "";
    for (let i = 0; i < words.length; i++)
    {
        newString += words[i];
        if (words[i] == toLower(words[i]) && words[i + 1] == toUpper(words[i + 1]))
        {
            newString += " ";
        }
    }
    return newString;
}
