import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return handleIndexNowSubmission();
}

export async function POST(request: Request) {
  return handleIndexNowSubmission();
}

async function handleIndexNowSubmission() {
  const host = 'trajettacompany.com.br';
  const key = 'e7c8b3691f1a4e2196a0a0319eb31c89';
  const keyLocation = `https://${host}/e7c8b3691f1a4e2196a0a0319eb31c89.txt`;

  const urlList = [
    `https://${host}/`,
    `https://${host}/en`,
    `https://${host}/llms.txt`,
    `https://${host}/llms-full.txt`,
    `https://${host}/termos`,
    `https://${host}/en/terms`,
  ];

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        host,
        key,
        keyLocation,
        urlList,
      }),
    });

    const status = response.status;
    return NextResponse.json({
      success: status === 200 || status === 202,
      status,
      submittedUrls: urlList.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('IndexNow submission failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 }
    );
  }
}
