fs = require('fs');
let data = fs.readFileSync('Lena.raw')
let array = new Array(512)
array.fill(0)
let count = 0;
let lastValue = 0

/* 一般的方法
for(let key in data){ //還沒跳脫最後那些東西
    let value = data[key]
    if(typeof value != 'number' || key == 'offset')
        continue
    array[value]++
    count++
}*/

for(let key in data){ //還沒跳脫最後那些東西
    let value = data[key]
    if(typeof value != 'number' || key == 'offset')
        continue
    let t = value - lastValue
    lastValue = value
    array[t+256]++
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