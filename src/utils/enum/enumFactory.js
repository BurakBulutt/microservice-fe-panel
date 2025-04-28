import {ContentTypeEnum, XmlDefinitionType} from "./enums";

export default function (enumType) {
    switch (enumType) {
        case "contentType": return ContentTypeEnum;
        case "xmlDefinitionType": return XmlDefinitionType;
        default: throw new Error("Unsupported enum type");
    }
}