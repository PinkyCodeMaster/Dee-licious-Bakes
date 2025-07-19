import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import { subscribeEmailSchema, type SubscribeResponse } from '@/lib/validations/subscription';
import { ZodError } from 'zod';
import { env } from '@/lib/env';



export async function POST(request: NextRequest): Promise<NextResponse<SubscribeResponse>> {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request data
    const validatedData = subscribeEmailSchema.parse(body);

    // Add contact to Resend audience
    let result;
    try {
      result = await resend.contacts.create({
        email: validatedData.email,
        firstName: validatedData.firstName,
        unsubscribed: false,
        audienceId: env.CAKE_AUDIENCE_ID,
      });
    } catch (resendError) {
      console.error('Resend API exception:', resendError);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to subscribe. Please check your email address and try again.',
        },
        { status: 400 }
      );
    }

    // Handle Resend API errors
    if (result.error) {
      console.error('Resend API error:', result.error);

      // Check for duplicate email error
      if (result.error.message?.includes('already exists') ||
        result.error.message?.includes('duplicate') ||
        result.error.message?.includes('Contact already exists')) {
        return NextResponse.json(
          {
            success: false,
            message: 'This email is already subscribed to our newsletter.',
          },
          { status: 409 }
        );
      }

      // Check for invalid email format from Resend
      if (result.error.message?.includes('email') &&
        result.error.message?.includes('invalid')) {
        return NextResponse.json(
          {
            success: false,
            message: 'Please enter a valid email address.',
          },
          { status: 400 }
        );
      }

      // Handle other API errors
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to subscribe. Please try again later.',
        },
        { status: 500 }
      );
    }

    // Success response
    console.log(`New subscriber added: ${validatedData.email}`, {
      contactId: result.data?.id,
      source: validatedData.source,
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed! Welcome to Dee\'s cake newsletter.',
      contactId: result.data?.id,
    });

  } catch (error) {
    console.error('Subscribe API error:', error);

    // Handle validation errors
    if (error instanceof ZodError) {
      const firstError = error.issues[0];
      return NextResponse.json(
        {
          success: false,
          message: firstError?.message || 'Validation error',
        },
        { status: 400 }
      );
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request format.',
        },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  );
}