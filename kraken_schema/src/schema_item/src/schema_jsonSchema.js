





export function get_jsonSchemaLight() {
    return jsonSchemaBuilder(ClipboardItem, true);
}

export function get_jsonSchema() {
    return jsonSchemaBuilder(ClipboardItem, false);
}

    
export function jsonSchemaBuilder(item, isLight) {

    // 

    if (item.enumerationItems && item.enumerationItems.length > 0) {
        return getEnumeration(item);
    } else if (item.record_id == "URL") {
        return getUrl(item);
    } else if (item.record_type == "rdfs:Class") {
        return getClass(item);
    } else if (item.record_type == "rdf:Property") {
        return getProperty(item);
    } else if (item.record_type == "schema:DataType") {
        return getDatatype(item);
    }
}





function getEnumeration(item) {
    // Get enumeration
    var choices = [];
    for (let i = 0; i < item.enumerationItems.length; i++) {
        choices.push(item.enumerationItems[i].record_id);
    }

    var jsonRecord = {
        type: "string",
        choices: choices,
    };
    return jsonRecord;
}

function getUrl(item) {
    return {
        type: item.htmlType,
    };
}

function getClass(item) {

    if(isLight){
        var properties = item.properties;
    } else { 
        var properties = item.propertiesLight;
   };

    
    var jsonRecord = {
        title: item.record_id,
        type: "object",
        properties: {},
    };

    for (let i = 0; i < properties.length; i++) {
        var p = properties[i];
        if (p) {
            jsonRecord.properties[p.record_id] = p.jsonSchema;
        }
    }

    return jsonRecord;
}

function getProperty(item) {
    var jsonRecord = {
        type: "array",
        items: item.expectedType.jsonSchema,
    };
    return jsonRecord;
}

function getDatatype(item) {
    var jsonRecord = {
        type: this.jsonSchemaType,
        tags: [this.htmlType],
    };
    return jsonRecord;
}

