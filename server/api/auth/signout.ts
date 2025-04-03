export default defineEventHandler(async event => {
  try {
    const token = event.headers.get('authorization')?.split(' ')[1]
    if (!token) return createError({ statusCode: 400, statusMessage: 'No token provided' })
    return { message: 'Logged out successfully' }
  } catch (error) {
    console.error(error)
    return createError({ statusCode: 500, statusMessage: 'Internal server error' })
  }
})
