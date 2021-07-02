
const rules = {
  email: (options) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const invalid = !re.test(options.input.value);
    const message = `${options.input.name} is not a valid email address`
    return invalid ? message : false;
  },
  maxLength: (options) => {
    const invalid = options.input.value && options.input.value.length > options.validation.maxLength;
    const message = `${options.input.name} must be less than ${options.validation.maxLength} characters long`
    return invalid ? message : false;
  },
  required: (options) => {
    const invalid = !options.input.value; // if empty this returns true
    const message = `${options.input.name} is required`
    return invalid ? message : false;
  },
}

const validate = async (inputs) => {
  //    console.log(inputs)
  return Promise.all(inputs.map(async input => {
    input.invalid = false;
    for(const i in input.validations){
      const validation = input.validations[i];
      const rule = Object.keys(validation)[0];
      const invalid = rules[Object.keys(validation)[0]]({input: input, validation: validation });
      if(invalid){
        input.invalid = invalid;
        delete input.validations;
        return input;
      }
    }
    delete input.validations;
    return input;
  }));
}

module.exports = {
  validate,
}
