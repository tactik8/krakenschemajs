import configRecord from "../../../ref/configRecord.json" with { type: "json" };

export function get_localizedName(record_id, locale, defaultValue = null) {
    
    record_id = record_id.replace("schema:", "");
    record_id = record_id.toLowerCase();

    if (configRecord[record_id]) {
        // Find exact match
        if (configRecord[record_id]["name"][locale]) {
            return configRecord[record_id]["name"][locale];
        }

        // Find closest match
        var keys = Object.keys(configRecord[record_id]["name"]);
        var localeLang = locale.slice(0, 2).toLowerCase();
        for (let i = 0; i < keys.length; i++) {
            var lang = keys[i].slice(0, 2).toLowerCase();
            var localName = configRecord[record_id]["name"][keys[i]];

            if (lang == localeLang && localName) {
                return localName;
            }
        }
    }

    if (defaultValue) {
        return defaultValue;
    }

    return null;
}
