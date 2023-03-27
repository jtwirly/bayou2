import { getSession } from 'next-auth/react';
// import { Configuration } from "outseta-api-client";
// import { OutsetaApi } from 'outseta-api-client';
import OutsetaApiClient from 'outseta-api-client';

// const outsetaConfiguration = new Configuration({
//   apiKey: process.env.OUTSETA_API_KEY,
//   secretKey: process.env.OUTSETA_SECRET_KEY,
//   subdomain: 'lessonwiseai-2',
// });
// const outsetaApi = new OutsetaApi(outsetaConfiguration);

const outsetaApi = new OutsetaApiClient({
  apiKey: process.env.OUTSETA_API_KEY,
  secretKey: process.env.OUTSETA_SECRET_KEY,
  subdomain: 'lessonwiseai-2',
});


export default async (req, res) => {
  console.log({req})
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const user = session.user.email;

  try {
    const { data } = await outsetaApi.get(`/api/v1/subscriptions?subscriptions.customer.email=${user}`);
    const subscription = data?.subscriptions?.[0];
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const userPlan = subscription.plan;
    const quotaUsed = subscription.features.find(feature => feature.name === 'Lesson Plan Quota')?.quantityUsed || 0;
    const quotaLimit = userPlan.features.find(feature => feature.name === 'Lesson Plan Quota')?.quantity || 0;

    res.status(200).json({ quotaUsed, quotaLimit });
  } catch (error) {
    console.error('Failed to fetch plan quota', error);
    res.status(500).json({ message: 'Failed to fetch plan quota' });
  }
};
