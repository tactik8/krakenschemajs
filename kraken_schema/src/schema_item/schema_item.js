import  configRecord from '../../ref/configRecord.json' with { type: 'json' };

import { schemaHeadings } from './src/schema_headings.js';

import { get_jsonSchema } from './src/schema_jsonSchema.js';
import { get_jsonSchemaLight } from './src/schema_jsonSchema.js';
import { get_htmlType } from './src/schema_htmlTypes.js';
import { get_jsonSchemaType } from './src/schema_jsonTypes.js';

import { get_localizedName } from './src/schema_localization.js';

export class KrSchemaItem {
    /* Contains metadata to qualify a value

    Attributes:
    - classes:
        - parentClasses: the classes (things) that are parent to the schema (thing -> person)
        - properties: the properties items that are part of the class
        - proeprtiesLight: minimum set of properties
        - jsonSchema: returns jsonSchema for given class
        - jsonSchemaLight: returns jsonSchema with only light properties
    - properties:
        - expectedTypes: list of all types expected for the value of the property
        - expectedType: most frequent type for the property
    - types:    
        - htmlType: returns the html type (text, url, email, etc) for forms
        - enumerationItems: returns expected items for value (dropdown list)
   

    Methods:
    - getProperty(propertyID):   returns a specific property
    - getLocalizedID:            returns localized version of id/propertyID
    - getLocalizedPropertyID:    duplicate
    - get_heading1(record):      given a record, returns heading1 value
    - get_heading2(record):      given a record, returns heading2 value
    - get_headingText(record):   given a record, returns headingText value
    - get_heading_image(record): returns url for the image 
  
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

    get minimumViableProperties() {
        /**
         * Returns most common properties.
         */
        let record_id = this.record_id.replace("schema:", "");
        record_id = record_id.toLowerCase();

        //let properties =  this.record[record_id]['minimumKeys'];

        let properties;

        if (
            configRecord[record_id] &&
            configRecord[record_id]["propertiesLight"] &&
            configRecord[record_id]["propertiesLight"].length > 0
        ) {
            properties = configRecord[record_id]["propertiesLight"];
        } else {
            properties = ["name", "url"];
        }

        return properties;
    }

    // localization
    getLocalizedPropertyID(locale, defaultValue){
        return get_localizedName(this.record_id, locale, defaultValue);
    }

    // Headings
    get_heading1(record) {
        return schemaHeadings.get_heading1(record);
    }

    get_heading2(record) {
        return schemaHeadings.get_heading1(record);
    }

    get_headingText(record) {
        return schemaHeadings.get_headingText(record);
    }
    
    get_heading_text(record) {
        return schemaHeadings.get_headingText(record);
    }

    get_headingImage(record){
        return schemaHeadings.get_headingImage(record);
    }
    
    get_heading_image(record){
        return schemaHeadings.get_headingImage(record);
    }

    get_headingThumbnail(record){
        return schemaHeadings.get_headingThumbnail(record);
    }
    
    get_heading_thumbnail(record){
        return schemaHeadings.get_headingThumbnail(record);
    }


    // types

    get jsonSchemaType(){
        return get_jsonSchemaType(this);
    }

    get htmlType() {
        // Returns the corresponding html type for forms
        return get_htmlType(this);
    }
    
    // Json schemas
    get jsonSchema() {
        return get_jsonSchema(this);
    }
    
    get jsonSchemaLight() {
        return get_jsonSchemaLight(this);
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
