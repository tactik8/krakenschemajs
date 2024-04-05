# Kraken Schema JS

Schema.org library to be used as a js library.



## Installation
```
import { KrakenSchemas } from 'https://cdn.jsdelivr.net/gh/tactik8/krakenschemajs@main/kraken_schema/kraken_schema.js';

```

## How to use

```
let schema = KrakenSchemas.get('Thing');

Provides the schema for a given schema object. 


```

## Attributes and methods

Attributes:
- classes:
    - parentClasses: the classes (things) that are parent to the schema (thing -> person)
    - properties: the properties items that are part of the class
    - propertiesLight: minimum set of properties
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

## Headings
Returns the value to be used for a heading depending on the type. 
For example, for listItem, returns the heading for the item object. 

### Examples:
- heading1(person_record): givenName familyName ('John Smith')

### Heading1
Main heading. Defaults to name

### Heading2 
Secondary. Defaults to url

### Text
Defaults to description

### image
Main image url. Defaults to image.contentUrl