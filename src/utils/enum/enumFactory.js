import {ContentTypeEnum} from "./enums";

export default function (enumType) {
    switch (enumType) {
        case "contentType": return ContentTypeEnum;
        default: throw new Error("Unsupported enum type");
    }
}