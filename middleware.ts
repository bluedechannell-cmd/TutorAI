import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/chat(.*)'])

export default clerkMiddleware(
  (auth, req) => {
    if (isProtectedRoute(req)) auth().protect()
  },
  {
    proxyUrl: process.env.NEXT_PUBLIC_CLERK_PROXY_URL,
  }
)

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
