let a = {title:"The Alchemist",author:"Paulo Coelho",isRead:true};
let b = a.isRead ? `You have read "${a.title}" by ${a.author}.` : `You have not read "${a.title}" by ${a.author}.`;
console.log(b);
