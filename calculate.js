fs = require('fs');
let data = fs.readFileSync('Baboon.raw')
let array = new Array(255)
array.fill(0)
let count = 0;

for(let key in data){ //還沒跳脫最後那些東西
    let value = data[key]
    if(typeof value != 'number' || key == 'offset')
        continue
    array[value]++
    count++
}

console.log()
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