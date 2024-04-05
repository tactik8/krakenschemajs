
import { KrakenSchemas as k} from '../kraken_schema.js';






// Run the test
test('KrSchemaDb init', function () {

    

    var input_value = 'Action';
    var expected_result = input_value;
    var item  = k.get('Action');
    var actual_result = item.record_id;

    // 
    expect(actual_result).toStrictEqual(expected_result);


    // property
    var nameProperty = item.getProperty('name');
    expect(nameProperty.record_id).toStrictEqual('name');

    // expected types
    //console.log(nameProperty.expectedTypes);
    var actual_result = nameProperty.expectedTypes[0].name;
    var expected_result = 'text';
    expect(actual_result).toStrictEqual(expected_result);


});


