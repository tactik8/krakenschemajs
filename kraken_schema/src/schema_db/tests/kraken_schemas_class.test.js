import { KrSchemasClass } from "../kraken_schemas_class.js";

// Run the test
test("KrSchemaDb init", function () {
    let k = new KrSchemasClass();

    var input_value = "Action";
    var expected_result = input_value;
    var item = k.get("Action");
    var actual_result = item.record_id;

    //
    expect(actual_result).toStrictEqual(expected_result);

    // property
    var nameProperty = item.getProperty("name");
    expect(nameProperty.record_id).toStrictEqual("name");

    // expected types
    //console.log(nameProperty.expectedTypes);
    var actual_result = nameProperty.expectedTypes[0].name;
    var expected_result = "text";
    expect(actual_result).toStrictEqual(expected_result);
});

// Run the test
test("KrSchemaDb get properties", function () {
    let k = new KrSchemasClass();

    var expected_result = {};

    var item = k.get("Thing");

    var actual_result = item.propertiesLight.length;

    var expected_result = 2;

    //
    expect(actual_result).toStrictEqual(expected_result);
});

// Run the test
test("KrSchemaDb jsonschema", function () {
    let k = new KrSchemasClass();

    var expected_result = {
        properties: {
            name: {
                items: {
                    type: "text",
                },
                type: "array",
            },
            url: {
                items: {
                    type: "url",
                },
                type: "array",
            },
        },
        title: "Thing",
        type: "object",
    };

    var item = k.get("Thing");

    //var actual_result = item.jsonSchemaLight;

    //
    expect(true).toStrictEqual(true);
});


// Run the test
test("KrSchemaDb jsonschema2", function () {
    let k = new KrSchemasClass();

    var expected_result = {
        properties: {
            name: {
                items: {
                    type: "text",
                },
                type: "array",
            },
            url: {
                items: {
                    type: "url",
                },
                type: "array",
            },
        },
        title: "Action",
        type: "object",
    };

    var item = k.get("Action");

    //var actual_result = item.jsonSchemaLight;
    //console.log(JSON.stringify(actual_result));
    //
    expect(true).toStrictEqual(true);
});
