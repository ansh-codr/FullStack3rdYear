let arr = [1,2,3,4,5];
console.log(arr);

//map
let newarr = arr.map((n) => {return n*n});
console.log(newarr);

//filter

let filarr = arr.filter(n=>n%2==0);
console.log(filarr);

//find
let founarr = arr.find(n=> n>3);
console.log(founarr);