

export function get_jsonSchemaType(item){

    if (item.parentClasses.includes("Enumeration")) {
        return "string";
    };

    switch (item.record_id) {
        case "Boolean": {
            return "boolean";
        }
        case "Date": {
            return "string";
        }
        case "DateTime": {
            return "string";
        }
        case "Number": {
            return "number";
        }
        case "Float": {
            return "number";
        }
        case "Integer": {
            return "integer";
        }
        case "Text": {
            return "string";
        }
        case "CssSelectorType": {
            return "string";
        }
        case "PronounceableText": {
            return "string";
        }
        case "URL": {
            return "string";
        }
        case "url": {
            return "string";
        }
        case "XPathType": {
            return "string";
        }
        case "Time": {
            return "string";
        }
        default:
            return "object";
    }

}