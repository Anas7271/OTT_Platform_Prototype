import { NextResponse } from 'next/server';
import { getContentCollection } from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Debug content API called');

    const contentCollection = await getContentCollection();

    // Get total count
    const totalAll = await contentCollection.countDocuments({});
    console.log('Total documents in collection:', totalAll);

    // Get all documents (limit 10)
    const allContent = await contentCollection
      .find({})
      .limit(10)
      .toArray();

    console.log('Found documents:', allContent.length);

    // Show sample document structure
    if (allContent.length > 0) {
      console.log('Sample document:', JSON.stringify(allContent[0], null, 2));
    }

    return NextResponse.json({
      success: true,
      totalDocuments: totalAll,
      documentsFound: allContent.length,
      sampleData: allContent.length > 0 ? allContent[0] : null,
      allDocuments: allContent,
    });
  } catch (error: any) {
    console.error('Debug content API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}