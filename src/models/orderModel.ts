import mongoose, { Schema } from 'mongoose'

const orderSchema = new Schema({
  sellerId: String,
  productId: String,
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
});

const subscriptionSchema = new mongoose.Schema({
    sellerId: String,
    subscription: {
        endpoint:{
            type:String,
            required:true
        },
        keys: {
            p256dh: {type:String ,required:true},
            auth: {type:String , required:true}
          }
    },
  });

const notificationSchema = new Schema({
    id:{
        type: Schema.Types.ObjectId,
        auto: true,
    },
    endpoint:{
        type:String,
        required:true
    },
    p256dh:{
        type:String,
        required:true
    },
    auth:{
        type:String,
        required:true
    }
});

export const notifications = mongoose.model('notifications',notificationSchema);
export const Order = mongoose.model('order',orderSchema)
export const Subscription = mongoose.model('Subscription', subscriptionSchema);
