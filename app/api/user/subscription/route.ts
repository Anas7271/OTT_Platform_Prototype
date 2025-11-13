import { NextRequest, NextResponse } from 'next/server';
import { getUsersCollection } from '@/lib/mongodb';
import { requireAuth } from '@/lib/middleware';

async function handleUpdateSubscription(request: NextRequest, user: any) {
  try {
    const body = await request.json();
    const { subscriptionPlan } = body;

    // Validate subscription plan
    const validPlans = ['default', 'lite', 'premium'];
    if (!validPlans.includes(subscriptionPlan)) {
      return NextResponse.json(
        { error: 'Invalid subscription plan' },
        { status: 400 }
      );
    }

    const usersCollection = await getUsersCollection();

    // Update user subscription
    const result = await usersCollection.updateOne(
      { email: user.email },
      {
        $set: {
          subscriptionPlan,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get updated user
    const updatedUser = await usersCollection.findOne({ email: user.email });

    return NextResponse.json({
      message: 'Subscription updated successfully',
      subscriptionPlan,
    });
  } catch (error) {
    console.error('Update subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const PUT = requireAuth(handleUpdateSubscription);