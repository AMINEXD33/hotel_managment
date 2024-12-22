
/**
 * this function returns a boolean depending on what
 * regex the user is trying to match on
 * this function expects an object
 *  {
 *      value: "-----",
 *      regex: /^abcd$/,
 *      sideEffect: callBack,
 *      sideEffectVariables: [a,b,c....] 
 *  }
 * @param {*} param0 
 */
export default function formChecker(matcheObj){

    const sideEffect = matcheObj.sideEffect;
    const sideEffectVariables = matcheObj.sideEffectVariables;
    const value = matcheObj.value;
    const regex = matcheObj.regex;
    
    const evaluation = regex.test(value);

    if (!typeof sideEffect === 'function'){
        console.error(`the setTrigger you passed for object ${index} is not a function`);
    }
    sideEffect(evaluation, ...sideEffectVariables);
    
}