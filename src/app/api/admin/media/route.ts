import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/admin/auth'
import { addAuditEntry } from '@/lib/admin/data'
import { createClient } from '@supabase/supabase-js'

function sb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

const BUCKET = 'cleano-media'

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data } = await sb().from('media_files').select('*').order('uploaded_at', { ascending: false })
  return NextResponse.json(data || [])
}

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const contentType = req.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    const body = await req.json()
    if (body._action === 'delete') {
      // Delete from storage
      const { data: item } = await sb().from('media_files').select('url, filename, folder').eq('id', body.id).single()
      if (item) {
        const storagePath = `${item.folder}/${item.filename}`
        await sb().storage.from(BUCKET).remove([storagePath])
      }
      await sb().from('media_files').delete().eq('id', body.id)
      await addAuditEntry({ userId: session.userId, userName: session.name, action: 'delete', resource: 'media', details: `Deleted: ${item?.filename}` })
      return NextResponse.json({ success: true })
    }
  }

  if (contentType.includes('multipart/form-data')) {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || 'general'
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase()
    const filename = `${Date.now()}-${safeName}`
    const storagePath = `${folder}/${filename}`

    const bytes = await file.arrayBuffer()
    const { error: uploadErr } = await sb().storage.from(BUCKET).upload(storagePath, bytes, {
      contentType: file.type,
      upsert: false,
    })

    if (uploadErr) {
      return NextResponse.json({ error: `Upload failed: ${uploadErr.message}` }, { status: 500 })
    }

    const { data: { publicUrl } } = sb().storage.from(BUCKET).getPublicUrl(storagePath)

    const { data: row } = await sb().from('media_files').insert({
      filename:    file.name,
      url:         publicUrl,
      folder,
      size:        file.size,
      mime_type:   file.type,
      uploaded_by: session.name,
    }).select().single()

    await addAuditEntry({ userId: session.userId, userName: session.name, action: 'create', resource: 'media', details: `Uploaded: ${file.name}` })
    return NextResponse.json({ success: true, item: row })
  }

  return NextResponse.json({ error: 'Bad request' }, { status: 400 })
}
