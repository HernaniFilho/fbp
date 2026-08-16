import {
  createRouter as createTanStackRouter,
  useRouter,
  type ErrorComponentProps,
} from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { getContext } from './integrations/tanstack-query/root-provider'

function DefaultErrorComponent({ error, reset }: ErrorComponentProps) {
  const router = useRouter()

  const message = error.message || 'An unknown error occurred'

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6 p-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold text-destructive">
          Something went wrong
        </h1>
        <p className="text-muted-foreground max-w-md">{message}</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => {
            router.invalidate()
          }}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
        <button
          onClick={() => router.navigate({ to: '/' })}
          className="px-4 py-2 border border-border rounded-md font-medium hover:bg-accent transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  )
}

export function getRouter() {
  const context = getContext()

  const router = createTanStackRouter({
    routeTree,
    context,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent,
  })

  setupRouterSsrQueryIntegration({ router, queryClient: context.queryClient })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
