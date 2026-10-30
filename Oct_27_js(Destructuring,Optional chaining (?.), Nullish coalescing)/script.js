let arr = [1,2,3,4];
let brr = arr;

brr.push(4);

console.log(brr);

brr= [...arr];
brr.push(5);

console.log(arr);
console.log(brr);
