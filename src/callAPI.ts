const baseURL: string = `http://riotsociety.us:8000/`;
export async function GET(reqPath: string, searchString: string) {
    let reqURL = baseURL + reqPath;
    let resData: any[];
    if (searchString != null && searchString != undefined) {
        if (searchString.includes('=')) { 
            reqURL += '?' + searchString;
        } else {
            reqURL += '?_id=' + searchString;
        }
    }
    const response = await fetch( reqURL, {
        mode: 'cors',
        method: 'GET',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json',}
    })
    .then(response => response.json())
    .then(data => {
        resData = data;
    })
    .catch((error) => {
        console.log('Error:', error);
        resData = error;
    });
    return resData;
}
export async function POST(reqPath: string, bodyData: any[]) {
    let resData: any[];
    let reqURL = baseURL + reqPath;
    const response = await fetch( reqURL, {
        mode: 'cors',
        method: 'POST',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
        body: JSON.stringify(bodyData)
    })
    .then(response => response.json())
    .then(data => {
        resData = data;
    })
    .catch((error) => {
        console.log('Error:', error);
        resData = error;
    });
    return resData;
} 

export async function PUT(reqPath: string, bodyData: any[], ID: string) {
    let resData: any[];
    let reqURL = baseURL + reqPath + "/" + ID;
    console.log(JSON.stringify(bodyData));
    const response = await fetch( reqURL, {
        mode: 'cors',
        method: 'PUT',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
        body: JSON.stringify(bodyData)
    })
    .then(response => response.json())
    .then(data => {
        
        resData = data;
    })
    .catch((error) => {
        console.log('Error:', error);
        resData = error;
    });
    return resData;
} 
