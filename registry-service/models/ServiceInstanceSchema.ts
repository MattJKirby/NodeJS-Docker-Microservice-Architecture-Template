import mongoose, { Schema } from 'mongoose'

const serviceInstanceSchema = new Schema({
     type: {
        type: String,
        required: true
     },
     instances: {
         type: Number,
         required: true,
         default: 0
     }

})

export default mongoose.model('ServiceInstance', serviceInstanceSchema)