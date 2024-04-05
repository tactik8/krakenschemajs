import configRecord from '../../../ref/configRecord.json' with { type: 'json' };



export var schemaHeadings = {
    get_heading1: get_heading1,
    get_heading2: get_heading2,
    get_headingText: get_headingText,
    get_headingImage: get_headingImage,
    get_headingThumbnail: get_headingThumbnail
}


function get_heading1(record) {
    return getHeadings(record,'heading1');
}

function get_heading2(record) {
    return getHeadings(record,'heading2');
}

function get_headingText(record) {
    return getHeadings(record,'headingText');
}

function get_headingImage(record){
    return getHeadings(record,'headingImage');
}

function get_headingThumbnail(record){
    return getHeadings(record,'headingThumbnail');
}


function getHeadings(record, headingName){

    // Convert record_type to lowerCase
    var record_type = record['@type'].toLowerCase();

    // Retrive config parameters from config record
    var configRecordHeading = configRecord[record_type]['headings'][headingName];
    var backupConfigRecordHeading = configRecord[record_type]['headings']['thing'];

    // Retrives properties and separator. Default to thing if missing
    if( configRecordHeading && configRecordHeading['properties'].length > 0){
        var keys = configRecordHeading["properties"];
        var separator = configRecordHeading["separator"];
    } else {
        var keys = backupConfigRecordHeading["properties"];
        var separator = backupConfigRecordHeading["separator"];
    };

    // Builds the heading based on the properties
    let values = [];

    // Iterate through eack properties
    for (let i=0; i< keys.length; i++){

        var value = getPropertyValueFromDot(keys[i], record, headingName)
        
        values.push(value);
    };

    var newValue = values.filter(Boolean).join(separator);

    return newValue;
}

function getPropertyValueFromDot(key, value, headingName){
    // Retrieves value by following dot notation
    
    var items =key.split('.');
    
    for (let t=0; t<items.length; t++){
        value = value[items[t]];
    };

    // If last value element s object, retrives the equivalent heading for object
    if (value && value['@type']){
        value = getHeadings(value, headingName);
    };

    return value;
}