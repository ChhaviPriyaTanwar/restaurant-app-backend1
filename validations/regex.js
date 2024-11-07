const regexPatterns = {
    name: /^[A-Za-z\s]{2,}$/, 
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^\d{10}$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$.!%*?&]{6,}$/,
    description: /^.{10,200}$/, 
    price: /^\d+(\.\d{1,2})?$/, 
    category: /^[a-zA-Z\s]{3,30}$/ 
};

module.exports = regexPatterns;


