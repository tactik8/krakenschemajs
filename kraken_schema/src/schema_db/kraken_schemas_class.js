
import  schemaData from '../../ref/schema.json' with { type: 'json' };


import {KrSchemaItem} from '../schema_item/schema_item.js';



let classesDB = [];
let propertiesDV = [];
let DB = {};
let configDB = {};

export class KrSchemasClass  {
    /* Contains metadata to qualify a value

    attributes:
   \


    Methods

    */


    constructor(name) {

        this._db = DB;
        this._classes = classesDB;
        this._properties = propertiesDV;
        this._config = configDB;

        this._config.ready = false;
        this._config.inProgress = false;

        this.init();
    }

   
    _start_init(){


        if (this._config.ready == true){ return };
        if (this._config.inProgress == true){ 
            return ;        
        };
        this._config.inProgress = true;
        
        //console.log('Init Start');
        //await this.getAllSchemas();
        this.getAllSchemas();
        this.classifyItems();
        this.assignPropertiesToClassItems();
        this.assignExpectedTypesToProperties();
        this.assignSubclassOf();
        this.assignEnumerationItems();
        this._config.ready = true;
        this._config.inProgress = false;
        
        //console.log('Init End');
        return;

    }

    init(){
        this._start_init();
        if (this._config.ready != true){ 
            //console.log('wait complete', this._config.ready);
            return;
        };
        
    }
    
    get length(){
        return Object.keys(this._db).length;
    }

    get(record_id){

        return this.getItem(record_id);

    }
    
    getItem(record_id){

      
        if(!record_id){
            return null;
        };
        record_id = record_id.replace('schema:', '');


        
        return this._db[record_id.toLowerCase()];
    }

    get items(){

        return this.getItems();
       
    }

    getItems(){

        //await this.init();

        let keys = Object.keys(this._db);

        let results = [];
        for(let i=0; i< keys.length; i++){
            results.push(this.get(keys[i]));
        };
        return results;

    }
    
    
    async getAllSchemasOLD() {

        /**
         * Loads all schemas from file and insert into database
         */
        //let url = 'https://schema.org/version/latest/schemaorg-current-https.jsonld';
        
        console.log('GetAllSchemas Start');
        
        let url = './kraken_thing/kraken_schema/ref/schemaorg-all-http.jsonld';
        const response = await fetch(url);
        const schemas = await response.json();
    
     
    
        let item;
    
        for(let i=0; i < schemas['@graph'].length; i++){

            item = new KrSchemaThing();
            item.record = schemas['@graph'][i];
    
            this._db[item.record_id] = item;
    
        };
    
        console.log('GetAllSchemas End');
    
    
    }

    getAllSchemas() {
        // get the schema.org data from json file (imported in header)
        let item;

        for(let i=0; i < schemaData['@graph'].length; i++){
      
            item = new KrSchemaItem();
            item.record = schemaData['@graph'][i];

            this._db[item.record_id.toLowerCase()] = item;
        };
    }
    

    classifyItems(){

        //console.log('ClassifyItems Start');
        let items = this.items;

        for(let i=0; i < items.length; i++){

            let item = items[i];
            
            if (item.record_type == 'rdf:Property'){
                this._properties.push(item);
            };
            if (item.record_type == 'rdfs:Class'){
                this._classes.push(item);
            };
        };
        //console.log('ClassifyItems End');
        return;
    }

    assignPropertiesToClassItems(){

        //console.log('assignPropertiesToClassItems Start');
        
        let items = this.items;

        for(let i=0; i < items.length; i++){

            let item = items[i];

            
            if (item._record['schema:domainIncludes']){
                var classes = item._record['schema:domainIncludes'];
                classes = ensureArray(classes);
    

                for(let ii=0; ii< classes.length; ii++){
                    //console.log(properties[i], classes);
                    
                    var class_record_id = classes[ii]['@id'];
                    var classObject = this.get(class_record_id);
                    if(classObject && classObject._properties){
                        classObject._properties.push(item);
                    };
        
                };
              
            };
        };
        //console.log('assignPropertiesToClassItems End');
        return;
    }
    assignExpectedTypesToProperties(){

        //console.log('assignTypesToProperties Start');
        let items = this._properties;

        for(let i=0; i < items.length; i++){

            if (items[i]._record['schema:rangeIncludes']){
                var domains = items[i]._record['schema:rangeIncludes'];
                domains = ensureArray(domains);

                if(domains && domains.length > 0){
                    for(let ii=0; ii< domains.length; ii++){
         
                        var record_id = domains[ii]['@id'];
                        record_id = record_id.replace('schema:', '');
                        var classObject = this.get(record_id);
                        if(classObject){
                            items[i]._expectedTypes.push(classObject)
                        };

                    };
                };
            };
        };
        //console.log('assignTypesToProperties End');
        return;
    }
    assignSubclassOf(){

        //console.log('assignSubclassOf Start');
        let items = this.items;

        for(let i=0; i < items.length; i++){

            if (items[i]._record['rdfs:subClassOf']){
                var domains = items[i]._record['rdfs:subClassOf'];
                domains = ensureArray(domains);

                if(domains && domains.length > 0){
                    for(let ii=0; ii< domains.length; ii++){

                        var record_id = domains[ii]['@id'];
                        record_id = record_id.replace('schema:', '');
                        var classObject = this.get(record_id);

                        if (classObject && classObject.record_id){
                            items[i]._subClassOf.push(classObject);
                            classObject._subClasses.push(items[i]);
                        };
                        //classObject._properties.push(items[i]);

                    };
                };
            };
        };
        //console.log('assignSubclassOf End');
        return;
    }
    assignEnumerationItems(){

        
        let items = this.items;

        for(let i=0; i < items.length; i++){

            let item = items[i];

            let parentClasses = item.record_type;
            parentClasses = ensureArray(parentClasses);

            for(let t=0; t < parentClasses.length; t++){
                
                var parentClass = this.get(parentClasses[t]);

                if (parentClass){
                    parentClass._enumerationItems.push(item);
                };

            };
            
        };
        //console.log('assignSubTypes End');
        return;
    }
}





function ensureNotArray(value) {
    let new_value = ensureArray(value);
    if(new_value.length > 0){
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