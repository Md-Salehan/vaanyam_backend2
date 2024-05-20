import mongoose, {Schema} from "mongoose"

const BlockerSchema = new Schema({
    status: {
        type: Boolean,
        required: [true, "status is Required"]
    },
    site: {
        type: String,
        required: [true, "site name is Required"]
    },
}, {timestamps: true})



export const Blocker = mongoose.model("Blocker", BlockerSchema)