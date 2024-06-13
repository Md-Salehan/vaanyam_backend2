import mongoose, {Schema} from "mongoose";

const itinaryDetailSchema = {
    title1: {
        type: String,
        // required: [true, "Title 1 field is Required"],
        trim: true,
        default: "",
    },
    title2: {
        type: String,
        // required: [true, "Title 1 field is Required"],
        trim: true,
        default: "",
    },
    tags: {
        type: String,
        // required: [true, "tags field is Required"],
        trim: true,
        default: "",
    },
    icons: {
        type: String,
        // required: [true, "icons field is Required"],
        trim: true,
        default: "",
    },
    texts: {
        type: String,
        // required: [true, "texts field is Required"],
        trim: true,
        default: "",
    },
    imgList:[{
        type: String,
        trim: true,
    }],
    
}
const itinarySchema = {
    day: {
        type: Number,
        default: 0,
    },
    night: {
        type: Number,
        default: 0,
    },
    detail: [itinaryDetailSchema],
    isExist: {
        type: Boolean,
        default: false
    },

}
const destinationSchema = new Schema({
    about: {
        type: String,
        // required: [true, "about field is Required"],
        trim: true,
        default: "",
    },
    place: {
        type: String,
        // required: [true, "place field is Required"],
        trim: true,
        default: "",
    },
    map: {
        type: String,
        // required: [true, "map field is Required"],
        trim: true,
        default: "",
    },
    touristAttractions: {
        type: String,
        // required: [true, "tourist Attractions field is Required"],
        trim: true,
        default: "",
    },
    bestTimeVisit: {
        type: String,
        // required: [true, "best to Time Visit field is Required"],
        trim: true,
        default: "",
    },
    imagePath: {
        type: String,
        // required: [true, "main image is Required"],
        trim: true,
        default: "",
    },
    locType: {
        type: String,
        required: [true, "Location Type is Required"],
    },
    default: {
        type: Boolean,
        default: false,
    },
    itinary: itinarySchema
})

export const Destination = mongoose.model("Destination", destinationSchema)