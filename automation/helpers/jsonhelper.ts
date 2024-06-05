import * as jsonPath from '@irrelon/path';
import { aut_apiCommonConfig } from "../../playwright.config";
import fs from 'fs';
import path from 'path';
import * as stringHelpers from './stringhelpers'

/**
 * A json object search that handles a complex json object, received as a string. The fieldName is ONLY a simple field name string NOT a path. fieldValue can be any type.
 * 
 *      "<fieldName>":<fieldValue>
 * 
 * @param inputJsonString A valid json object in string format, if empty then returns false. 
 * @param fieldName The field name to search for, if empty returns false. 
 * @param fieldValue The value the field should have
 * @returns bool
 */
export function jsonStringContainsFieldAndValueAnywhere(inputJsonString: string|undefined, fieldName: string, fieldValue: any){
    if (!inputJsonString) {
        return false; 
    }
    if (!fieldName || fieldName.length < 1) {
        return false; 
    }
    
    try {
        let myData = JSON.parse(inputJsonString);
        return ObjectContainsFieldAndValueAnywhere(myData, fieldName, fieldValue);
    } catch (e) {
        doLogException('jsonStringContainsFieldAndValueAnywhere - exception: ', e);
        return false; 
    }
}
/**A json object search that handles a complex json object. The fieldName is ONLY a simple field name string NOT a path. fieldValue can be any type.
 * Note: Uses .findPath as match seemed to only find the first fieldname.
 * @param inputData 
 * @param fieldName 
 * @param fieldValue 
 * @returns 
 */
export function ObjectContainsFieldAndValueAnywhere(inputData: any, fieldName: string, fieldValue: any){
    if (!inputData) {
        return false; 
    }
    if (!fieldName || fieldName.length < 1) {
        return false; 
    }
    
    try {
        let searchJson = JSON.parse("{\"" + fieldName + "\" : \"\"}"); 
        searchJson[fieldName] = fieldValue; 

        //return  jsonPath.match(inputData, searchJson); 
        let result : any = jsonPath.findPath(inputData, searchJson); 
        return result.match; 
    } catch (e) {
        doLogException('ObjectContainsFieldAndValueAnywhere - exception: ', e);
        return false; 
    }
}

export function jsonLoadFileAsObject(fileName: string): any {
    try {
        let fullFileName = path.join(aut_apiCommonConfig.testDataDir,"json", fileName);
        return JSON.parse(fs.readFileSync(fullFileName, 'utf-8'));
    } catch (e){
        doLogException("", e);
    }
    return undefined; 
}

function doLogException(msg: string, e: unknown){
    let logMsg = msg ?? 'No message exception.'; 
    if (typeof e === "string") {
        logMsg += " " + e.toString() // works, `e` narrowed to string
    } else if (e instanceof Error) {
        logMsg += " " + e.message // works, `e` narrowed to Error
    }
    console.log(logMsg);
}
export function searchJsonStringObjectForPathWithSpecialValue(inJsonString : string|undefined, fieldNamePath: string, fieldNameValue: string, logger: (msg: string) => void){
    if (!inJsonString) { logger("searchObjectForPathWithSpecialValue - Invalid object to search"); return false; }
    let jsonObject;
    try {
        jsonObject = JSON.parse(inJsonString);
    } catch (e) {
        doLogException("searchJsonStringObjectForPathWithSpecialValue failed to parse json input string.", e);
    }
    return searchObjectForPathWithSpecialValue(jsonObject, fieldNamePath, fieldNameValue, logger);
}
/**
 * Searches for a field path and a given value in a Json object.
 * Handles special values of 
 *      __FIELD_DOES_NOT_EXIST__   -> expect field value to be undefined/not exist
 *      __NUM__X      -> expects value to be an integer equal to parsing X
 *      __BOOL__Y      -> expects value to be a bool by parsing Y where Y is either true or false
 * @param inObject 
 * @param fieldNamePath 
 * @param fieldNameValue 
 * @param logger 
 * @returns true/false
 */
export function searchObjectForPathWithSpecialValue(inObject : any, fieldNamePath: string, fieldNameValue: string, logger: (msg: string) => void){
    if (!inObject) { logger("searchObjectForPathWithSpecialValue - Invalid object to search"); return false; }
    if (!fieldNamePath) { logger("searchObjectForPathWithSpecialValue - Invalid field name"); return false; }
    if (fieldNamePath.startsWith("__ANYWHERE__")){
        let fieldNameReplaced = fieldNamePath.replace("__ANYWHERE__","");
        let searchJson = "FieldName: (" + fieldNameReplaced+ ") with value: (" + fieldNameValue + ")"; 
        logger("Searching anywhere in object for: " + searchJson);
        fieldNameReplaced = fieldNameReplaced.replace("<topic_environment_name>",aut_apiCommonConfig.TOPICENVIRONMENTNAME);
        let fieldValueReplaced = fieldNameValue.replace("<topic_environment_name>",aut_apiCommonConfig.TOPICENVIRONMENTNAME);
        let fieldValueTyped = stringHelpers.DataTableValueToType(fieldValueReplaced);
        return ObjectContainsFieldAndValueAnywhere(inObject,fieldNameReplaced, fieldValueTyped);
    } else {
    let searchJson = "Path: (" + fieldNamePath+ ") with value: (" + fieldNameValue + ")"; 
        logger("Searching in object for: " + searchJson);
        let currentValue = jsonPath.get(inObject, fieldNamePath);
        if (fieldNameValue === "__FIELD_DOES_NOT_EXIST__") {
            return (typeof currentValue === "undefined");
        } else {
            let fieldValueReplaced = fieldNameValue.replace("<topic_environment_name>",aut_apiCommonConfig.TOPICENVIRONMENTNAME);
            let fieldValueTyped = stringHelpers.DataTableValueToType(fieldValueReplaced);
            if (typeof fieldValueTyped === "string" && fieldValueTyped.startsWith("__STARTSWITH__")){
                return currentValue.startsWith(fieldValueTyped.replace("__STARTSWITH__",""));
            }
            else if (typeof fieldValueTyped === "string" && fieldValueTyped.startsWith("__DATECMPMINS__")) {
                return stringHelpers.DateStringCompare(logger, currentValue, fieldValueTyped.replace("__DATECMPMINS__",""), 60);
            }
            else if (typeof fieldValueTyped === "string" && fieldValueTyped.startsWith("__DATECMP__")) {
                return stringHelpers.DateStringCompare(logger, currentValue, fieldValueTyped.replace("__DATECMP__",""));
            }
            return currentValue === fieldValueTyped;
        }
    }
}
/**
 * Sets a field path to a given value in a Json object.
 * Handles special values of 
 *      __FIELD_REMOVE__   -> Unsets (removes) the field.
 *      __NUM__X      -> sets value as an integer by parsing X
 *      __BOOL__Y      -> sets value as a bool by parsing Y where Y is either true or false
 * @param inObject 
 * @param fieldNamePath 
 * @param fieldNameValue 
 * @param logger 
 * @returns 
 */
export function ObjectSetWithSpecialValue(inObject : any, fieldNamePath: string, fieldNameValue: string, logger: (msg: string) => void){
    if (!inObject) { logger("ObjectSetWithSpecialValue - Invalid object to set"); return false; }
    if (!fieldNamePath) { logger("ObjectSetWithSpecialValue - Invalid field name"); return false; }
    if (fieldNameValue === "__FIELD_REMOVE__") {
        let updateInfo = "Removing field with path: (" + fieldNamePath+")"; 
        logger("Updating object field and value to: " + updateInfo);
        jsonPath.unSet(inObject, fieldNamePath);
        return true; 
    } else {
        let updateInfo = "Path: (" + fieldNamePath + ") to value: (" + fieldNameValue + ")"; 
        logger("Updating object field and value to: " + updateInfo);
        let fieldValueReplaced = fieldNameValue.replace("<topic_environment_name>",aut_apiCommonConfig.TOPICENVIRONMENTNAME);
        let fieldValueTyped = stringHelpers.DataTableValueToType(fieldValueReplaced);
        jsonPath.set(inObject, fieldNamePath, fieldValueTyped);
        return true;
    }
}
/**
 * Compare two objects or Json objects and return true if exactly match, including value types of number, bool, string etc.
 * 
 * @param inObject  
 * @param comparisonObject 
 * @param logger 
 * @param excludingKeys An array of field names that if found to have a difference will be skipped (and logged) so won't affect the overall result.
 * @returns true if there are differences, false if not.
 */
export function ObjectIsEqualTo(inObject : any, comparisonObject : any, logger: (msg: string) => void, excludingKeys : string[]) {
    if (!inObject) { logger("ObjectIsEqualTo - Invalid object1"); return false; }
    if (!comparisonObject) { logger("ObjectIsEqualTo - Invalid comparison object"); return false; }
    let diffRecords: Record<string, jsonPath.DiffValue> = jsonPath.diffValues(inObject, comparisonObject, "", true, undefined, undefined, undefined); 
    let isSame = true; 
    if (Object.keys(diffRecords).length > 0) {
        for (const keyName of Object.keys(diffRecords)){ 
            let diffValue = diffRecords[keyName]; 
            let skipDiff = false; 
            for (const excludingKeyName of excludingKeys){
                if (excludingKeyName.toLowerCase() == keyName.toLowerCase()){
                    skipDiff = true; 
                }
            }
            if (skipDiff){
                logger("Skipping Excluded Difference: (" + keyName + ") type: (" + diffValue.difference + ") this: (" + diffValue.val1 + ") is not (" + diffValue.val2 +")");
            } else {
                logger("Difference: (" + keyName + ") of type: (" + diffValue.difference + ") this: (" + diffValue.val1 + ") is not (" + diffValue.val2 +")");
                isSame = false;
            }
        }
    }
    return isSame; 
}



