/* 
* Function to create a valid looking GUID string.
*  It's not as unique as it should be for a GUID, hence for test purposes only.   
*  Inspiration from this Public Domain/MIT licensed answer which also discusses caveats https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid
*   Note: Uses time in microseconds since page-load or current timestamp until depleted as seed on random number.

* returns: 5 part simple GUID string, e.g.  ef004f89-a96a-46f3-adb6-0d4e2fd23032
*/
export function generateUUID() {
    let dTimeStamp = new Date().getTime();
    let dTimeSincePageLoad = (performance?.now && (performance.now() * 1000)) || 0;//
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let randomNumber = Math.random() * 16;
        if (dTimeStamp > 0) {
            randomNumber = (dTimeStamp + randomNumber) % 16 | 0;
            dTimeStamp = Math.floor(dTimeStamp / 16);
        } else {
            randomNumber = (dTimeSincePageLoad + randomNumber) % 16 | 0;
            dTimeSincePageLoad = Math.floor(dTimeSincePageLoad / 16);
        }
        return (c === 'x' ? randomNumber : (randomNumber & 0x3 | 0x8)).toString(16);
    });
}

/**
 * A helper to convert strings with true/false text to a boolean.
 * @param input A string like '1', 'true', 'false' etc
 * @returns a bool or undefined.
 * 
 * Examples: 
 * console.log(convertToBoolean("")); // false
 * console.log(convertToBoolean("1")); // true
 * console.log(convertToBoolean("0")); // false
 * console.log(convertToBoolean("true")); // true
 * console.log(convertToBoolean("false")); // false
 * console.log(convertToBoolean("True")); // true
 * console.log(convertToBoolean("False")); // false
 * console.log(convertToBoolean("invalid")); // undefined
 * console.log(convertToBoolean(undefined)); // undefined
 * console.log(convertToBoolean(null)); // undefined
 */
export function convertToBoolean(input: string | undefined): boolean | undefined {
    try {
        if (typeof input == 'undefined' || input == null) { return undefined; }
        if (input.trim() == '') return false;
        if (input.trim() == '1') return true;
        if (input.trim() == '0') return false;
        return JSON.parse(input.toLowerCase());
    }
    catch (e) {
        return undefined;
    }
}

/*
*   A helper to convert json string values into objects including empty objects
*/
export function convertToObjectSafe(input: string | undefined): object {
    try {
        if (typeof input == 'undefined' || input == null) { return {}; }
        return JSON.parse(input);
    }
    catch (e) {
        return {};
    }
}

/* A helper to format date time to  4/03/2024, 2:05 am*/
export function formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Pacific/Auckland'
    };

    return date.toLocaleString('en-NZ', options);
}

/**
 * Helper to return a current date object in UTC in this format: 2024-05-06T23:48:36.025+0000
 * @param date 
 * @param stripSeconds Optional, if given then replace seconds and microseconds as 00.000
 * @returns 
 */
export function formatDateUTCWithTimeZone(date: Date, clearSeconds: boolean|undefined = undefined): string {
    // Get the individual components of the ISO string
    const isoDateString = date.toISOString();  //this is in UTC will end in Z
    // const isoTimezoneOffset = date.getTimezoneOffset();
    // const timezoneOffsetHours = Math.floor(Math.abs(isoTimezoneOffset) / 60);
    // const timezoneOffsetMinutes = Math.abs(isoTimezoneOffset) % 60;
    // const timezoneOffsetSign = isoTimezoneOffset > 0 ? '-' : '+';
    let sliceEnd = 23; 
    let secondsText = "+0000";
    if (clearSeconds){
        sliceEnd = 16;
        secondsText = ":00.000+0000"
    }
    // Construct the desired string format
    // const formattedDateString = isoDateString.slice(0, sliceEnd) + secondsText + timezoneOffsetSign +
    //     ('0' + timezoneOffsetHours).slice(-2) +
    //     ('0' + timezoneOffsetMinutes).slice(-2);
    const formattedDateString = isoDateString.slice(0, sliceEnd) + secondsText;
    return formattedDateString;
}
/** Generate random text data, just input length of random text
 *  
 */
export function generateRandomText(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/** Generate a string using the given prefix and random text data up to the max length provided.
 *  
 */
export function generateStringWithPrefix(prefix: string, maxLength: number): string {
    return prefix + generateRandomText(maxLength - prefix.length);
}

/** Generate a random mobile phone number as a string
 *  
 */ 
export function generateRandomMobilePhoneNumber(): string {
    const countryCode = "+64"; // You can adjust the country code as needed
    const areaCode = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // Random 3-digit area code
    const prefix = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // Random 3-digit prefix
    const lineNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); // Random 4-digit line number
    return `${countryCode}${areaCode}${prefix}${lineNumber}`;
}

/** Generate a random ZIP code
 *  
 */ 
export function generateRandomZipCode(): string {
    const minZipCode = 10000; // Minimum ZIP code value
    const maxZipCode = 999999; // Maximum ZIP code value
    const randomZipCode = Math.floor(Math.random() * (maxZipCode - minZipCode + 1)) + minZipCode;
    return randomZipCode.toString();
}

/** Generate a random string with special characters
 *  
 */ 
export function generateRandomSpecialString(length: number): string {
    const characters = "!@#$%^&*()_+-=[]{}|;:,.<>?/~";
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}

/** Generate a random number with specified length
 *  
 */ 
export function generateRandomNumberWithLength(length: number): string {
    let randomNumber = '';
    for (let i = 0; i < length; i++) {
        randomNumber += Math.floor(Math.random() * 10); // Generate a random digit (0-9) and append it to the number
    }
    return randomNumber;
}

/** Generate a random month
 *  
 */ 
export function generateRandomMonth(): string {
    const months = [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
    ];
    const randomIndex = Math.floor(Math.random() * months.length);
    return months[randomIndex];
}
/**
 * Look in string for special values and return object of that type, if not return as string.
 *  __NUM__X   returns X parsed as a Number()
 *  __BOOL__Y   returns Y parsed as a Boolean()  (Y might be false, true)
 * @param inString the string to assess.  If null or empty or "" returns "". 
 * @returns 
 */
export function DataTableValueToType(inString: string) {
    if (!inString || inString.length < 1 || inString == "\"\"") {
        return "";
    }
    if (inString.startsWith("__NUM__")) {
        return Number(inString.replace("__NUM__", ""));
    }
    if (inString.startsWith("__BOOL__")) {
        return convertToBoolean(inString.replace("__BOOL__", ""));
    }
    return inString;
}

/**
 * A simple helper to escape special characters for display in html.
 * From examples like https://www.30secondsofcode.org/js/s/escape-unescape-html/
 * @param str 
 * @returns 
 */
export function escapeHTML(str: string) {
    if (!str) { return ""; }
    return str.replace(/[&<>'"]/g,
        tag =>
        ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
/**
 * Helper to compare two date strings. 
 * @param date1String 
 * @param date2String 
 * @param withinSeconds If set, then return false only if the difference is more than that many seconds. 
 * @returns true if the two are the same.
 */
export function DateStringCompare(logger: (msg: string) => void, date1String: string, date2String: string, withinSeconds: number = 0){
    logger(`DateStringCompare - (${date1String}) with (${date2String})`);
    let date1 = new Date(date1String);
    let date2 = new Date(date2String); 
    let seconds = Math.abs(date1.getTime() - date2.getTime())/1000;
    
    if (withinSeconds > 0 ) {
        if (seconds > withinSeconds) {
            logger(`DateStringCompare - dates are more than ${withinSeconds} different (${seconds}). `);
            return false; 
        }
        return true; 
    }
    if (seconds != 0) {
        logger(`DateStringCompare - exact - dates are different (${seconds}). `);
        return false; 
    }
    return true;
}
