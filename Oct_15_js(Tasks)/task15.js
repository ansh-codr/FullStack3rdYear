let a = s => {
    let b = 0;
    for (let c of s.toLowerCase()) {
        if ("aeiou".includes(c)) b++;
    }
    return b;
};
console.log(a("JavaScript"));
