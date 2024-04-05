
import { get_localizedName} from '../schema_localization.js';








// Run the test
test('KrSchemaItem init', function () {

    var result = get_localizedName('action', 'en-US');
    expect(result).toStrictEqual('action');

    var result = get_localizedName('givenName', 'fr-CA');
    expect(result).toStrictEqual('prénom');

    var result = get_localizedName('givenName', 'fr-FR');
    expect(result).toStrictEqual('prénom');

    var result = get_localizedName('action', 'en-CA');
    expect(result).toStrictEqual('action');

    var result = get_localizedName('action', 'aa-CC');
    expect(result).toStrictEqual(null);

    var result = get_localizedName('action', 'aa-CC', 'bob');
    expect(result).toStrictEqual('bob');
    
});


