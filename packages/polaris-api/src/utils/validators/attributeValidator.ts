"use strict";

/*
 *  This service ensures a given attribute name exists against a given Model
 */
const attributeValidator = { validate: {} };

attributeValidator.validate = (modelObj: any, parameterAttributes: any) => {
  for (const parameterAttribute in parameterAttributes) {
    let attributeLocated = false;
    for (const modelAttribute in modelObj.rawAttributes) {
      if (modelAttribute === parameterAttribute) {
        attributeLocated = true;
      }
    }
    if (!attributeLocated) {
      return { error: true, message: parameterAttribute + " is not a valid attribute." };
    }
  }

  return { error: false, message: "Attributes are valid." };
};

export { attributeValidator };
