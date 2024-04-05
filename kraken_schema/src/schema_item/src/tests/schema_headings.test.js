
import { schemaHeadings} from '../schema_headings.js';








// Run the test
test('KrSchemaItem init', function () {

    let record = {
        "@type": "Thing",
        "@id": "id1",
        "name": "name1",
        "url": "https://www.test.com/",
        "description": "description1",
        "image": {
            "@type": "imageObject",
            "@id": "image1",
            "name": "image1Name",
            "contentUrl": "https://www.test.com/image1.jpg"
        }
    }
    
    // 
    expect(schemaHeadings.get_heading1(record)).toStrictEqual('name1');
    expect(schemaHeadings.get_heading2(record)).toStrictEqual('https://www.test.com/');
    expect(schemaHeadings.get_headingText(record)).toStrictEqual('description1');
    expect(schemaHeadings.get_headingImage(record)).toStrictEqual('https://www.test.com/image1.jpg');


});



// Run the test
test('KrSchemaItem compound', function () {

    let record = {
        "@type": "listItem",
        "@id": 'lsitItem1',
        "name": "listItemName1",
        "item": {
            "@type": "Thing",
            "@id": "id1",
            "name": "name1",
            "url": "https://www.test.com/",
            "description": "description1",
            "image": {
                "@type": "imageObject",
                "@id": "image1",
                "name": "image1Name",
                "contentUrl": "https://www.test.com/image1.jpg"
            }
        },
        "position": 4
    }

    // 
    expect(schemaHeadings.get_heading1(record)).toStrictEqual('name1');
    expect(schemaHeadings.get_heading2(record)).toStrictEqual('https://www.test.com/');
    expect(schemaHeadings.get_headingText(record)).toStrictEqual('description1');
    expect(schemaHeadings.get_headingImage(record)).toStrictEqual('https://www.test.com/image1.jpg');


});
