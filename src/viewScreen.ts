import * as CallAPI from "./callAPI";
import * as Button from "./buttons";
import * as CreateElements from "./createElements";
import * as ManageElements from "./manageElements"
import { toNumber } from "lodash";

export async function ViewScreen(reqPath: string, formDivLocation:string, btnDivLocation:string, data?: any) {
    await ManageElements.setMainDivs('View', reqPath, formDivLocation, btnDivLocation);
    let resData: any = await CallAPI.GET(reqPath, data);
    let resKeys = Object.keys(resData[0]);
    let count = resKeys.length;
    for (let i = 0; i < count; i++) {
        let inputLabel = document.createElement('label');
        inputLabel.setAttribute("for", `${[resKeys[i]]}`);
        inputLabel.innerHTML = `${[resKeys[i]]}:  `;
        inputLabel.setAttribute("id", `${[resKeys[i]]}`);
        let inputField = document.createElement('input'); 
        inputField.setAttribute("id", `${[resKeys[i]]}`);
        inputField.setAttribute("value", `${[resData[0][resKeys[i]]]}`);
        let lineBreak = document.createElement('br');
        lineBreak.setAttribute('getElementById', "br" + count);
        document.getElementById(formDivLocation).appendChild(lineBreak);
        document.getElementById(formDivLocation).appendChild(inputLabel);  
        document.getElementById(formDivLocation).appendChild(inputField);
        };
        Button.backBtn(reqPath, formDivLocation, btnDivLocation);
        Button.editBtn(reqPath);
}
export function selectView(reqPath:
      string, formDivLocation:string, btnDivLocation:string, isModal:boolean){
    ManageElements.setMainDivs('View', reqPath, formDivLocation, btnDivLocation, isModal);
    let div = CreateElements.BaseElements('div', 'filtersDiv');
    ManageElements.displayElements(div, formDivLocation);
    let table = CreateElements.BaseElements('table', 'filtersTable');
    ManageElements.displayElements(table, formDivLocation);
    ///to be replaced with CSS later
    document.getElementById('filtersTable').setAttribute('border', '1');
    document.getElementById('filtersTable').setAttribute('cellborder', '1');
    let requiredFields: any = CreateElements.RequiredFields(reqPath);
    requiredFields.unshift('_id');
    buildTable(requiredFields, null, reqPath, formDivLocation, btnDivLocation, isModal);
    Button.clearBtn(reqPath, formDivLocation, "subFormDiv", isModal);
}

async function buildTable(requiredFields:any[], filterString: string, reqPath: string, formDivLocation:string, btnDivLocation:string, isModal: boolean) {

    let resData: any[] = await CallAPI.GET(reqPath, filterString);
    document.getElementById('filtersDiv').innerHTML='';
    let tr = CreateElements.BaseElements('tr', 'headRow');
    await ManageElements.displayElements(tr, 'filtersTable');
    let th = CreateElements.BaseElements('th', 'blankCorner');
    await ManageElements.displayElements(th, 'headRow');
    requiredFields.forEach(async function (x: string) {
        let th = CreateElements.BaseElements('th', 'th'+x);
        await ManageElements.displayElements(th, 'headRow');
        document.getElementById('th'+x).innerHTML=x;
    });
    th = CreateElements.BaseElements('th', 'thDescription');
    await ManageElements.displayElements(th, 'headRow');
    document.getElementById('thDescription').innerHTML='Description';
    if (reqPath != 'item' && reqPath != 'type') {
        document.getElementById('thDescription').setAttribute('hidden', 'true'); 
    }
    resData.forEach(async (x ,index)=> {
        let tr = CreateElements.BaseElements('tr', `row${index}`);
        await ManageElements.displayElements(tr, 'filtersTable'); 
        let td = CreateElements.BaseElements('td', x._id);
        await ManageElements.displayElements(td, `row${index}`);
        if (isModal) {
            if (!(reqPath === 'item') || toNumber(x.Quantity) > 0) {    
                Button.modalSelectBtn(reqPath, x._id, x._id, formDivLocation, btnDivLocation, 'select-button');
            }
        } else {
            Button.selectBtn(reqPath, x._id,  btnDivLocation,  formDivLocation, 'select-button');
        }
        requiredFields.forEach(async (y, yindex) => {
            let td = CreateElements.BaseElements('td', `td${index}${yindex}`);
            await ManageElements.displayElements(td, `row${index}`);
            document.getElementById(`td${index}${yindex}`).innerHTML=x[y];
            delete x[y];
        });
        if (reqPath === 'item' || reqPath === 'type') {
            let descTd = CreateElements.BaseElements('td', `td${index}${requiredFields.length}`);
            await ManageElements.displayElements(descTd, `row${index}`);
            document.getElementById(`td${index}${requiredFields.length}`).innerHTML = ' ';
            let keys = Object.keys(x);
            for (let i = 0; i < keys.length; i++) {
                document.getElementById(`td${index}${requiredFields.length}`).innerHTML += keys[i] + ': ' + x[keys[i]] + ' ';
            }
        }
    });
    setupSelecters(filterString, requiredFields, resData, reqPath, formDivLocation, btnDivLocation, isModal);
}
function setupSelecters(inputValues: string, requiredFields: any[], resData: any[], reqPath: string, formDivLocation:string, btnDivLocatin:string, isModal:boolean) {
    requiredFields.forEach(async function (x:string) {
        let fields = CreateElements.Labels([x]);
        let selector = await CreateElements.DropDown(x);
        let labelAndSelectDiv = document.createElement('div');
        labelAndSelectDiv.classList.add('label-input-div');
        fields.forEach(async function (x:any) {
            labelAndSelectDiv.appendChild(x);
        });
        selector.forEach(async function(x:any) {
            labelAndSelectDiv.appendChild(x);
        });
        document.getElementById('filtersDiv').appendChild(labelAndSelectDiv);

        let selectorOptions = CreateElements.DropOptions(x, resData);
        await ManageElements.displayElements(selectorOptions, x);
        document.getElementById(x).addEventListener('change', async (e:Event) => {
            e.preventDefault();
            if (inputValues === null || inputValues === undefined) {
                inputValues = "";
            }
            document.getElementById('filtersTable').innerHTML="";
            let answer: HTMLInputElement = (document.querySelector("#" +x));
            document.getElementById(x).setAttribute('value', answer.value);
            inputValues += answer.id + '=' + answer.value + '&';
            buildTable(requiredFields, inputValues, reqPath, formDivLocation, btnDivLocatin, isModal);
        }); 
    });
}
