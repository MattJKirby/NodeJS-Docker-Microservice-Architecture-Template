import mongoose, { Schema } from 'mongoose'
import { ServiceStatus } from '../src/service/ServiceStatus'

const instanceSchema = new Schema({
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
    uid: {
        type: String,
        required: true,
       unique: true,
    },
});

export default instanceSchema