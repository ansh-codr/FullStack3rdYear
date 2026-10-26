document.addEventListener('keydown', e => {
    if (/[^a-zA-Z0-9\s]/.test(e.key)) {
        console.log("Special character");
    } else {
        console.log("Not a special character");
    }
});