import mongoose, { Schema } from 'mongoose'
import { ServiceStatus } from '../src/service/ServiceStatus'
import InstanceSchema from './InstanceSchema'
import { notEmpty } from './validations/instanceSchemaValidations'

const serviceSchema = new Schema({
     name: {
        type: String,
        required: true
     },
     version: {
         type: String,
         required: true 
     },
     instances: {
         type: [InstanceSchema.schema],
         required: true,
         validate: [notEmpty, "At least one service instance required!"],
         _id: false
     }

})

export default mongoose.model('Service', serviceSchema)