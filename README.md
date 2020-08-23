# adaptive-huffman-coding-FGK

## 如何執行
我的程式讀檔都必須要，更動程式碼才可以讀取不同的檔案，這點請注意一下謝謝！
```node main.js```

## 檔案說明

| 檔案名稱 | 功用 |
| - | - |
|main.js	|Adaptive Huffman coding – FGK|
|maindecode.js|	幫main.js壓縮的檔案decode|
|mainDPCM.js	|DPCM 的 Adaptive Huffman coding|
|maindecodeDPCM.js|	幫mainDPCM.js壓縮的檔案decode|
|compare.js |	比較兩個檔案內容是否一樣|
|calculate.js	|計算entropy|

## 程式流程

首先一般的Adaptive Huffman coding – FGK 我的流程大概是這樣
```
begin
    create node ZERO
    readSymbol(X)
    while (X!=EOF) do
     begin
       if (first_read_of(X)) then
        begin
          output(ZERO)
          output(X)
          create new node U with next nodes ZERO and new node X
          update_tree(U);
        end
       else
        begin
          output(X)
          update_tree(X)
        end
       readSymbol(X)
     end
end

procedure update_tree(U)
 begin
    while (U!=root) do
     begin
       if (exists node U1 with same value and greater order) then
          change U1 and U
       increment value of U
       U := parent(U)
     end
    increment value of U, update leaf codes
 end
```
[Reference](http://www.stringology.org/DataCompression/fgk/index_en.html)


只是我寫成JS 的版本
JS的讀檔(fs.readFileSync)會有 加入一些function 跟 offset
所以在壓縮的時候必須要避開他

然後update再找 order比他大但是value一樣的時候要直接找order最大的。
然後再換的時候如果發現是自己的root 就不換。
然後記得最後不滿八個編碼要flush 我把它塞滿1 湊到8個bit

**這有可能造成小bug 就是 剛好在讀這些塞滿的bit的時候會造成不小心讀到symbol.**

不過這次的兩份sample 都沒出現此問題，故沒有特別做處理。


## DPCM
最後DPCM的處理比較特別一點，照理來說要儲存負的數字，因為一個value有可能0~255，所以差值的範圍可以到-255~255，照理來說需要9個bit才能儲存，但是稍作觀察發現我只要繼續照樣存8個bit，舉例-130的表示法應該是101111110，但是我只存01111110到buffer中。到時候讀資料的時候直接照樣的加上去，但是要忽略最後第九個carry bit，這樣在decode的時候算出來的值會剛好一樣，這樣就只要8個bit照樣可以處理-255~255的範圍。

### Example
值
0 255 255 0

DPCM
0 255 0 -255 (1 00000001)

壓縮存到buffer是
0 255 0 1 (00000001)

解壓縮時(讀取)
0 255 255 0 (11111111 加上一個1 之後 忽略 carry bit 會變成 0)



