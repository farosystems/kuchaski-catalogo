import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const imageUrl = searchParams.get('url')

  if (!imageUrl) {
    return new NextResponse('Missing url parameter', { status: 400 })
  }

  // Solo permitir URLs de Supabase para seguridad
  if (!imageUrl.includes('supabase.co')) {
    return new NextResponse('Invalid URL', { status: 400 })
  }

  try {
    const response = await fetch(imageUrl)

    if (!response.ok) {
      return new NextResponse('Image not found', { status: 404 })
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg'
    const imageBuffer = await response.arrayBuffer()

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // 24 horas
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Error proxying image:', error)
    return new NextResponse('Error fetching image', { status: 500 })
  }
}