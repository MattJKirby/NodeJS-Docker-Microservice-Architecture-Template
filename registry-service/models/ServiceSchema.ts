import mongoose, { Schema } from 'mongoose'
import { ServiceStatus } from '../src/service/ServiceStatus'

const serviceSchema = new Schema({
     name: {
        type: String,
        required: true
     },
     version: {
         type: String,
         required: true 
     },
     hostname: {
         type: String,
         required: true,
         default: '127.0.0.1'
     },
     port: {
        type: Number,
        required: true 
     },
     registeredAt: {
         type: Date,
         required: true
     },
     lastHealthCheck: {
         type: Date,
         required : true
     },
     status: {
         type: String,
         retuired: true,
         enum: ServiceStatus,
         default: ServiceStatus.INITIALIZING
     },
     UID: {
         type: String,
         required: true,
        unique: true,
     }

})

export default mongoose.model('Service', serviceSchema)