fs = require('fs');

class Node {
    constructor(value,order,data,root,leftChild,rightChild) {
        this.value = value //出現次數
        this.order = order // 編號
        this.root = root
        this.left = leftChild
        this.right = rightChild
        this.data = data //代表哪個字
        this.code = ''
    }
}

let data = fs.readFileSync('afterCompress.bear')
let len = data.length
let longSting = ''
for(let i = 0 ; i < len ; i++){  //每個byte 組回來 變成一個很長的string
    let bin = data[i].toString(2);
    while(bin.length != 8){
        bin = '0'+bin
    }
    longSting += bin
}

let length = longSting.length
let bitIndex = 0
let NYT = new Node(0,256,"NYT")
let tree = [], readCode = ''
let iterator = NYT
tree.push(NYT)
let decodeResult = []
let lastValue = 0

while(bitIndex < length || iterator.data != -1){    
    if(iterator.data == 'NYT' || iterator.data != -1){ //到leaf
        if(iterator.data == 'NYT'){ //到點
            while(readCode.length != 8 )
                readCode += longSting.charAt(bitIndex++)
            let SymbalValue = parseInt(readCode, 2)
            let TEMPTEMP = addition(lastValue,SymbalValue)
            lastValue = TEMPTEMP
            decodeResult.push(TEMPTEMP)

            let newRootNode = new Node(0, NYT.order ,-1,NYT.root,NYT)
            let thisNode = new Node(1, newRootNode.order - 1, SymbalValue ,newRootNode)
            newRootNode.right = thisNode
            if(newRootNode.root)
                newRootNode.root.left = newRootNode

            NYT.root = newRootNode
            NYT.order-=2
            tree.push(newRootNode,thisNode)
            iterator = updateTree(newRootNode)//point iterator = root
            readCode = ''
        }else{
            let rr = iterator.data            
            let TEMPTEMP = addition(lastValue,iterator.data)
            decodeResult.push(TEMPTEMP)
            lastValue = TEMPTEMP
            iterator = updateTree(iterator)
        }
    }    
    let bit = longSting.charAt(bitIndex++)
    if(bit == '0'){ //往左走
        iterator = iterator.left
    }else{ //往右走
        iterator = iterator.right
    }
}
console.log(decodeResult.length)
let HI = decodeResult.length
var buffer = new Uint8Array(HI);

decodeResult.forEach((e,i)=>{
    buffer[i] = e
})
fs.writeFileSync('origin.bear', buffer)

function encodeing(node){
    if(node.left != undefined){
        node.left.code = node.code+'0'
        encodeing(node.left)
    }
    if(node.right != undefined){
        node.right.code = node.code+'1'
        encodeing(node.right)
    }
}

function updateTree(U){
    while(U.root != undefined ){ // U != root
        let result = tree.filter(node => U.value == node.value && U.order < node.order )
        let max
        if(result.length > 1){
            max = result.reduce(function(prev, current) {
                return (prev.order > current.order) ? prev : current
            })
        }
        if(result.length > 0 ){
            if(result[0] != U.root){                
                result = result.length > 1 ? max : result[0]
                let target = tree[tree.indexOf(result)]
                if(target.root.left == target && U.root.left == U){
                    U.root.left = target
                    target.root.left = U
                }else if(target.root.left == target && U.root.right == U){
                    target.root.left = U
                    U.root.right = target
                }else if(target.root.right == target && U.root.left == U){
                    target.root.right = U
                    U.root.left = target
                }else if(target.root.right == target && U.root.right == U){
                    target.root.right = U
                    U.root.right = target
                }
                let temp = Object.assign({}, target)
                target.root = U.root,target.order = U.order
                U.root = temp.root, U.order = temp.order
            }
        }
        U.value+=1
        U = U.root
    }
    U.value +=1
    encodeing(U)
    return U
}

function addition(a,b){
    a = dec2bin(a)
    b = dec2bin(b)
    let result = ''
    let carry = '0'
    for(let i = 7 ; i >= 0 ; i--){
        let temp = a.charAt(i) + b.charAt(i) + carry
        var count = (temp.match(/1/g) || []).length;
        if(count == 0){
            result = '0' + result 
            carry = '0'
        }else if(count ==1){
            result = '1' + result 
            carry = '0'
        }else if(count ==2){
            result = '0' + result 
            carry = '1'
        }else if(count ==3){
            result = '1' + result 
            carry = '1'
        }
    }
    return parseInt(result,2)
}

function dec2bin(dec){//10進位轉2進為
    let temp = (dec >>> 0).toString(2);
    while(temp.length!=8)
        temp = '0' +temp
    return temp
} 