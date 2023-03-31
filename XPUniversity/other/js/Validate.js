class Validate {
  constructor() {
    this._errors = [];
  }

  get errors() {
    return this._errors;
  }

  /**
   * 
   * @param {string} value 
   * @param {int} min 
   * @param {int} max 
   * @param {string} param 
   * @returns {boolean} 
   */
  length(value, min, max, param) {
    if (value.length < min || value.length > max) {
      this._errors.push(`${param} length must be between ${min} and ${max}`);
      return false;
    }
    return true;
  }

  isChosen(value, param) {
    if (value === "") {
      this._errors.push(`Please select a ${param}`)
      return false
    }
    return true
  }

  mininteger(input, minInt, name) {
    if (input < minInt) {
      this._errors.push(`Invalid input for ${name}`);
      return false;
    }
    return true
  }
  
  isNumber(input, name) {
    if (parseInt(input) === NaN) {
      this._errors.push(`Invalid input for ${name}`);
      return false;
    } 
    return true
  }
}
window.validate = new Validate;
// export default new Validate;