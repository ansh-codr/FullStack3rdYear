//FizzBuzz Basic : Print "fizz" if a aber is divisible by 3, buzz if by 5, fizzbuzz if by both or the aber itself if none
let a = 6;
if (a % 3 === 0 && a % 5 === 0) {
    console.log("fizzbuzz");
} else if (a % 3 === 0) {
    console.log("fizz");
} else if (a % 5 === 0) {
    console.log("buzz");
} else {
    console.log(a);
}