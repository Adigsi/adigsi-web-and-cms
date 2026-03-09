import { NextRequest, NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const isRead = searchParams.get('isRead')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const db = await getMongoDatabase()
    const collection = db.collection('registration_forms')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {}
    if (status) filter.status = status
    if (isRead === 'true') filter.isRead = true
    if (isRead === 'false') filter.isRead = false

    const [forms, total] = await Promise.all([
      collection.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments(filter),
    ])

    return NextResponse.json({
      forms: forms.map((f) => ({ ...f, _id: f._id.toString() })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error fetching registration forms:', error)
    return NextResponse.json({ error: 'Failed to fetch registration forms' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      organizationName,
      organizationType,
      registeredAddress,
      yearEstablished,
      primaryIndustry,
      organizationDescription,
      officialWebsite,
      contactPersonName,
      contactPersonPosition,
      contactEmail,
      contactPhone,
      certifications,
      previousEngagement,
      reasonForJoining,
      agreeCodeOfConduct,
      agreeToJoin,
      declareTruth,
    } = body

    // Validate required string fields
    const requiredStrings: [string, string][] = [
      [organizationName, 'organizationName'],
      [organizationType, 'organizationType'],
      [registeredAddress, 'registeredAddress'],
      [yearEstablished, 'yearEstablished'],
      [primaryIndustry, 'primaryIndustry'],
      [organizationDescription, 'organizationDescription'],
      [officialWebsite, 'officialWebsite'],
      [contactPersonName, 'contactPersonName'],
      [contactPersonPosition, 'contactPersonPosition'],
      [contactEmail, 'contactEmail'],
      [contactPhone, 'contactPhone'],
      [certifications, 'certifications'],
      [previousEngagement, 'previousEngagement'],
      [reasonForJoining, 'reasonForJoining'],
    ]
    for (const [value, fieldName] of requiredStrings) {
      if (!value?.trim()) {
        return NextResponse.json({ error: `${fieldName} is required` }, { status: 400 })
      }
    }

    // Validate checkboxes
    if (!agreeCodeOfConduct) return NextResponse.json({ error: 'agreeCodeOfConduct is required' }, { status: 400 })
    if (!agreeToJoin) return NextResponse.json({ error: 'agreeToJoin is required' }, { status: 400 })
    if (!declareTruth) return NextResponse.json({ error: 'declareTruth is required' }, { status: 400 })

    const validTypes = ['private_company', 'government_institution', 'non_profit']
    if (!validTypes.includes(organizationType)) {
      return NextResponse.json({ error: 'Invalid organizationType' }, { status: 400 })
    }

    const db = await getMongoDatabase()
    const collection = db.collection('registration_forms')

    const doc = {
      organizationName: organizationName.trim(),
      organizationType,
      registeredAddress: registeredAddress.trim(),
      yearEstablished: yearEstablished.trim(),
      primaryIndustry: primaryIndustry.trim(),
      organizationDescription: organizationDescription.trim(),
      officialWebsite: officialWebsite.trim(),
      contactPersonName: contactPersonName.trim(),
      contactPersonPosition: contactPersonPosition.trim(),
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim(),
      certifications: certifications.trim(),
      previousEngagement: previousEngagement.trim(),
      reasonForJoining: reasonForJoining.trim(),
      agreeCodeOfConduct: true,
      agreeToJoin: true,
      declareTruth: true,
      isRead: false,
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(doc)

    return NextResponse.json(
      { message: 'Registration form submitted successfully', id: result.insertedId.toString() },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error submitting registration form:', error)
    return NextResponse.json({ error: 'Failed to submit registration form' }, { status: 500 })
  }
}
