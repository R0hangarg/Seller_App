import { Request, Response } from "express";
import { Order, Subscription} from "../models/orderModel";
import webPush from 'web-push'



const vapidKeys = webPush.generateVAPIDKeys();
console.log(vapidKeys);

webPush.setVapidDetails(
  'mailto:your-email@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);


export const orderController = async(req:Request,res:Response)=>{
    const { sellerId, productId } = req.body;
  const order = new Order({ sellerId, productId });
  await order.save();
  res.status(201).json(order);
}

interface PushSubscription {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  }
export const updateOrderController = async(req:Request,res:Response)=>{
    const orderId = req.params.id;
    const { status } = req.body;
  
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
  
    if (!order) return res.status(404).send('Order not found');
  
    // Fetch subscriptions for the seller
    const subscriptions = await Subscription.find({ sellerId: order.sellerId });
  
    const payload = JSON.stringify({
      title: 'Order Status Update',
      body: `Your order ${orderId} status is now ${status}.`,
    });
    console.log("Before Subscrip")
  
    subscriptions.forEach(({ subscription }) => {
        if(subscription){
            console.log("Before webPUsh",subscription)
      webPush.sendNotification(subscription as PushSubscription, payload).
      then(response => {
        console.log('Notification sent successfully:', response);
    })
    .catch(async(error) => {
        console.error('Error sending notification:', error);
        if (error.statusCode === 410) {
            // Remove expired subscription from database
            await Subscription.deleteOne({ endpoint: subscription.endpoint });
        }
    });
    console.log("After webPUsh")

        }
    });
  
    res.status(200).json(order);
}

export const saveSubscription = async (subscription: any,sellerId:any): Promise<void> => {
    await Subscription.create({
      sellerId:sellerId,
      subscription:subscription
    });
  };

  
export const subscribe = async (req: Request, res: Response) => {
    try {
    const { sellerId, subscription } = req.body;
      await saveSubscription(subscription,sellerId);
      res.status(201).json({ message: 'Subscription added successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to subscribe.' ,error:error});
    }
  };


//   export const sendNotification = async (title: string, body: string, image: string): Promise<void> => {
//     const subscriptions = await notifications.find();
//     subscriptions.forEach((notifications:any) => {
//       const sub = {
//         endpoint: notifications.endpoint,
//         keys: {
//           p256dh: notifications.p256dh,
//           auth: notifications.auth
//         }
//       };
//       const payload = JSON.stringify({
//         notification: {
//           title,
//           body,
//           image,
//         },
//       });
//       webPush.sendNotification(sub, payload)
//         .catch(error => console.error('Error sending notification:', error));
//     });
//   };
  
// export const pushNotification = async (req: Request, res: Response) => {
// try {
//     const { title, body, image } = req.body;
//     await sendNotification(title, body, image);
//     res.status(200).json({ message: 'Notification sent successfully.' });
// } catch (error) {
//     res.status(500).json({ message: 'Failed to send notification.' ,error:error});
// }
// };