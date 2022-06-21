import prisma from '$lib/prisma'

export async function post({ request }) {
    const { id, lat, lng } = await request.json()
    const created = await prisma.junk.create({
        data: {
            photo: id,
            lat: lat,
            lng: lng,
        }
    })

    if (created) return {
        status: 201
    }

    console.log({ created });
    return {
        status: 500
    }

}