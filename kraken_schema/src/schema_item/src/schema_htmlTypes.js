


export function get_htmlType(item) {
    // Returns the corresponding html type for forms

    // if
    if (item.parentClasses.includes("Enumeration")) {
        return "select";
    }

    switch (item.record_id) {
        case "Boolean": {
            return "checkbox";
        }
        case "Date": {
            return "date";
        }
        case "DateTime": {
            return "datetime-local";
        }
        case "Number": {
            return "number";
        }
        case "Float": {
            return "number";
        }
        case "Integer": {
            return "number";
        }
        case "Text": {
            return "text";
        }
        case "CssSelectorType": {
            return "text";
        }
        case "PronounceableText": {
            return "text";
        }
        case "URL": {
            return "url";
        }
        case "url": {
            return "url";
        }
        case "XPathType": {
            return "text";
        }
        case "Time": {
            return "time";
        }
        default:
            return "object";
    }
}