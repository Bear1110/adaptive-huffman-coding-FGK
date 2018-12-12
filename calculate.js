fs = require('fs');
let data = fs.readFileSync('Lena.raw')
let array = new Array(512)
array.fill(0)
let count = 0;
let len = data.length

 //一般的方法 的 entropy
 
for(let i = 0 ; i < len ; i++){ 
    let value = data[i]
    array[value]++
    count++
}

/// DPCM 的 entropy
/*
let lastValue = 0
for(let i = 0 ; i < len ; i++){
    let value = data[i]
    let t = value - lastValue
    lastValue = value
    array[t+256]++
    count++
}*/

let sum = 0
array.forEach((e,i)=>{
    if(e==0)
        return
    let P = (e/count)
    sum += -( P * getBaseLog(2,P))
})
console.log(sum)
function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
}