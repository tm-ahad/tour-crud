
const dateValidator = date => {
   let dateFormat = /^(0?[1-9]|1[0-2])[\/](0?[1-9]|[1-2][0-9]|3[01])[\/]\d{4}$/
   return dateFormat.test(date);
};
export default dateValidator;