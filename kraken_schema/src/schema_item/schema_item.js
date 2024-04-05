export class KrSchemaItem {
    /* Contains metadata to qualify a value

    attributes:
   \
   - type_html: returns the html type (text, url, email, etc)
   - type_
   - value_options: possible values (when iteration present)
   - minimumViableProperties: plist of minimu property names for simple record
   


    Methods:
    - get_heading1:     given a record, returns heading1 value
    - get_heading2:     given a record, returns heading12 value
    - get_headingText:  given a record, returns headingText value
  
    */

    constructor(name) {
        this._record = {};
        this._properties = []; //inverse of domains includes
        this._subClassOf = []; // Parent classes inheriting from
        this._subClasses = []; // Child classes inheriting from this
        this._expectedTypes = []; // The types that this property can take
        this._enumerationItems = []; // Enumeration items that can be used for this
    }

    init() {
        return this.getFromSchemaOrg();
    }

    get record_id() {
        let id = this.record["@id"] || null;
        if (id == null) {
            return null;
        }
        id = id.replace("schema:", "");
        return id;
    }
    get record_type() {

        var record_types = ensureArray(this.record["@type"]);
        if(record_types.length > 1){
            for(let i=0; i< record_types.length; i++){
                if (record_types[i] != 'rdfs:Class'){
                    return record_types[i]
                };
            };
            return record_types[0];
        };

        return this.record["@type"] || null;
    }

    get name() {
        return this.record_id;
    }
    get record() {
        return this._record;
    }
    set record(value) {
        this._record = value;
    }

    get parentClasses() {
        let results = [];
        for (let i = 0; i < this._subClassOf.length; i++) {
            results.push(this._subClassOf[i].record_id);
            results = results.concat(this._subClassOf[i].parentClasses);
        }
        return results;
    }

    get properties() {
        // returns own properties and all properties of elements that are parent to it.
        let properties = this._properties;

        for (let i = 0; i < this._subClassOf.length; i++) {
            properties = properties.concat(this._subClassOf[i].properties);
        }
        return properties;
    }

    get propertiesLight() {
        // returns own properties and all properties of elements that are parent to it.

        let properties = [];

        let minProp = this.minimumViableProperties;
        for (let i = 0; i < minProp.length; i++) {
            properties.push(this.getProperty(minProp[i]));
        }

        return properties;
    }
    // methods

    getProperty(propertyID) {
        let properties = [...this.properties];

        for (let i = 0; i < properties.length; i++) {
            if (properties[i].record_id == propertyID) {
                return properties[i];
            }
        }
        return null;
    }

    get expectedType() {

        
        if (this._expectedTypes.length == 0) {
            return null;
        }
        if (this._expectedTypes.length == 1) {
            return this._expectedTypes[0];
        }

        
        for (let i = 0; i < this._expectedTypes.length; i++) {
            
            if (this._expectedTypes[i].htmlType == "object") {
                return this._expectedTypes[i];
            }
        };
        return this._expectedTypes[0];
    }

    get expectedTypes() {
        if (this._expectedTypes) {
            return this._expectedTypes;
        }
        return null;
    }
    get enumerationItems() {
        if (this._enumerationItems) {
            return this._enumerationItems;
        }
        return null;
    }

    get jsonSchemaType(){

        if (this.parentClasses.includes("Enumeration")) {
            return "string";
        };
            
        switch (this.record_id) {
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
    get htmlType() {
        // Returns the corresponding html type for forms

        // if
        if (this.parentClasses.includes("Enumeration")) {
            return "select";
        }

        switch (this.record_id) {
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

    get minimumViableProperties() {
        /**
         * Returns most common properties.
         */
        let record_id = this.record_id.replace("schema:", "");

        //let properties =  this.record[record_id]['minimumKeys'];

        let properties;

        if (
            this.configRecord[record_id] &&
            this.configRecord[record_id]["minimumKeys"] &&
            this.configRecord[record_id]["minimumKeys"].length > 0
        ) {
            properties = this.configRecord[record_id]["minimumKeys"];
        } else {
            properties = ["name", "url"];
        }

        return properties;
    }

    
    get_heading1(record) {

        return this.getHeadings(record,'heading1');
    }

    get_heading2(record) {

        return this.getHeadings(record,'heading2');
    }

    get_heading_text(record) {

        
        return this.getHeadings(record,'heading_text');
    }

    get_heading_image(record){

        var imageUrl = null;
        
        if (record['@type'] == 'listitem'){
            record = record.item;
        };
        if(record.image && record.image.contentUrl){
            imageUrl = record.image.contentUrl;
        };
        if(record.contentUrl){
            imageUrl = record.contentUrl;
        };
        return imageUrl;
    }

    getHeadings(record, headingName){

        var record_type = record['@type'].toLowerCase();
        if( this.configRecord[record_type]){
            var keys = this.configRecord[record_type][headingName]["properties"];
            var separator = this.configRecord[record_type][headingName]["separator"];
        } else {
            var keys = this.configRecord['thing'][headingName]["properties"];
            var separator = this.configRecord['thing'][headingName]["separator"];
        };


        
        let values = [];
        
        for (let i=0; i< keys.length; i++){

            var items = keys[i].split('.');
            
            var value = record;

            for (let t=0; t<items.length; t++){
                value = value[items[t]];
            };

            if (value && value['@type']){
                value = this.getHeadings(value, headingName);
            };
            
            values.push(value);
        };

        var newValue = values.filter(Boolean).join(separator);
        
        return newValue;

        
    }


    get jsonSchema() {

        if(this.enumerationItems && this.enumerationItems.length > 0){


            var choices = [];
            for(let i=0; i< this.enumerationItems.length; i++){
                choices.push(this.enumerationItems[i].record_id);
            };


            var jsonRecord = {
                type: "string",
                    choices: choices
            };
            return jsonRecord;

        };

        
        if (this.record_id == 'URL'){
            return {
                    type: this.htmlType,
                };
        };


        


        

        if (this.record_type == "rdfs:Class") {

            var jsonRecord = {
                title: this.record_id,
                type: "object",
                properties: {},
            };

            for (let i=0; i < this.properties.length; i++) {
                var p=this.properties[i];
                if(p){
                    jsonRecord.properties[p.record_id] = p.jsonSchema;
                };
            };

            return jsonRecord;

        } else if (this.record_type == "rdf:Property") {
            var jsonRecord = {
                type: "array",
                items: this.expectedType.jsonSchema,
            };
            return jsonRecord;

        } else if (this.record_type == 'schema:DataType') {
            var jsonRecord = {
                type: this.jsonSchemaType,
                tags: [this.htmlType]
            };
            return jsonRecord;
        }
    }
    get jsonSchemaLight() {


        if(this.enumerationItems && this.enumerationItems.length > 0){

            var choices = [];
            for(let i=0; i< this.enumerationItems.length; i++){
                choices.push(this.enumerationItems[i].record_id);
            };
            
            
            var jsonRecord = {
                type: "string",
                choices: choices
            };
            return jsonRecord;
            
        };

        
        if (this.record_id == 'URL'){
            return {
                    type: this.jsonSchemaType,
                    tags: [this.htmlType]
                };
        };
        
        if (this.record_type == "rdfs:Class") {

            var jsonRecord = {
                title: this.record_id,
                type: "object",
                properties: {},
            };

            for (let i=0; i < this.propertiesLight.length; i++) {
                var p=this.propertiesLight[i];
                if(p){
                    jsonRecord.properties[p.record_id] = p.jsonSchemaLight;
                };
            };

            return jsonRecord;
            
        } else if (this.record_type == "rdf:Property") {
            var jsonRecord = {
                type: "array",
                items: this.expectedType.jsonSchemaLight,
            };
            return jsonRecord;
            //return this.expectedType.jsonSchemaLight;
            
        } else if (this.record_type == 'schema:DataType') {
            var jsonRecord = {
                type: this.jsonSchemaType,
                tags: [this.htmlType]
            };
            return jsonRecord;
        }
    }

    

    get configRecord() {
        let record = {
            action: {
                minimumKeys: [
                    "name",
                    "url",
                    "alternateName",
                    "actionStatus",
                    "startTime",
                    "endTime",
                    "object",
                    "result",
                    "error",
                ],
                heading1Keys: null,
                heading1Separator: null,
            },

            organization: {
                minimumKeys: ["name", "address", "telephone", "email", "url"],
                heading1: {
                    properties: ["name"],
                    separator: ", ",
                },
                heading2: {
                    properties: ["url"],
                    separator: ", ",
                },
            },

            person: {
                minimumKeys: [
                    "givenName",
                    "familyName",
                    "jobTitle",
                    "worksFor",
                    "address",
                    "email",
                    "telephone",
                ],
                heading1: {
                    properties: ["givenName", "familyName"],
                    separator: " ",
                },
                heading2: {
                    properties: ["email"],
                    separator: ", ",
                },
            },

            postaladdress: {
                minimumKeys: [
                    "streetAddress",
                    "addressLocality",
                    "addressRegion",
                    "addressCountry",
                    "postalCode",
                ],
                heading1: {
                    properties: [
                        "streetAddress",
                        "addressLocality",
                        "addressRegion",
                    ],
                    separator: ", ",
                },
                heading2: {
                    properties: ["addressCountry", "postalCode"],
                    separator: ", ",
                },
            },
            
            listitem: {
                minimumKeys: [
                    "name",
                    "url",
                    "item",
                    "position"
                ],
                heading1: {
                    properties: [
                        "item",
                    ],
                    separator: ", ",
                },
                heading2: {
                    properties: ["item"],
                    separator: ", ",
                },
                heading_text: {
                    properties: ["item"],
                    separator: ", ",
                },
            },
            
            thing: {
                    minimumKeys: [
                        "name",
                        "url"
                    ],
                    heading1: {
                        properties: [
                            "name",
                        ],
                        separator: ", ",
                    },
                    heading2: {
                        properties: ["url"],
                        separator: ", ",
                    },
                    heading_text: {
                        properties: ["description"],
                        separator: ", ",
                    },
                },
        };

        return record;
    }
}

function ensureNotArray(value) {
    let new_value = ensureArray(value);
    if (new_value.length > 0) {
        return new_value[0];
    } else {
        return null;
    }
}

function ensureArray(value) {
    if (Array.isArray(value)) {
        return value;
    } else {
        return [value];
    }
}
