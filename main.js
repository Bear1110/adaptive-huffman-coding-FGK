fs = require('fs');
//http://ben-tanen.com/adaptive-huffman/
//http://www.stringology.org/DataCompression/fgk/index_en.html

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

let data = fs.readFileSync('Baboon.raw')
//let data = ['b','o','o','k','k','e','e','p','e','r']
//let data = ['a','a','r','d','v']
//let data = [5,5,128,9,10,9,8,7,6,5,1,3,4]

let tree = []
let seen = []
let output = ''
let NYT = new Node(0,256,"NYT")
tree.push(NYT)

for(let key in data){ //還沒跳脫最後那些東西
    let value = data[key]
    if(typeof value != 'number' || key == 'offset')
        continue
    if( seen.indexOf(value) == -1){ // 第一次看到這個symbol(data)
        let temp = value.toString(2)
        while(temp.length != 8){
            temp = '0'+temp
        }
        output += NYT.code + temp

        let newRootNode = new Node(0, NYT.order ,-1,NYT.root,NYT)
        let thisNode = new Node(1, newRootNode.order - 1, value ,newRootNode)
        newRootNode.right = thisNode
        if(newRootNode.root)
            newRootNode.root.left = newRootNode

        NYT.root = newRootNode
        NYT.order-=2
        tree.push(newRootNode,thisNode)
        updateTree(newRootNode)
        seen.push(value)
    }else{
        let target = tree[tree.indexOf(tree.filter(node => value == node.data)[0])]
        output += target.code
        updateTree(target)
    }
}

let gg = 0
if(output.length % 8 !=0)
    gg++
var buffer = new Uint8Array(output.length / 8 +gg);
let temp = '', bufferIndex = 0
for(let i = 0; i < output.length ; i++){
    let thisBit = output.charAt(i)
    temp += thisBit
    if(temp.length == 8){
        buffer[bufferIndex++] = parseInt(temp, 2)
        temp = ''
    }
}
if(temp != ''){ // flush
    while(temp.length != 8){
        temp += '1'
    }
    buffer[bufferIndex] = parseInt(temp, 2)
}
fs.writeFileSync('afterCompress.bear', buffer)

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
            if(result[0] != U.root){// 預防一開始就出現重複的東西 例如一開始就讀到 1,1              
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
}