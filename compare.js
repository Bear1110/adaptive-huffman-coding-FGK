fs = require('fs');
let data = fs.readFileSync('Lena.raw')
let data1 = fs.readFileSync('origin.bear')

for(let key in data){ //還沒跳脫最後那些東西
    let value = data[key]
    if(value != data1[key]){
        console.log(key,value,data1[key])
    }    
}

for(let key in data1){ //還沒跳脫最後那些東西
    let value = data1[key]
    if(value != data[key]){
        console.log(key,value,data[key])
    }    
}