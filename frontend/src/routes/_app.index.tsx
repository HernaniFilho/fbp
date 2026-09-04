import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/_app/')({ component: Home })
function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 mx-20 my-10 gap-15">
      <div className="flex flex-col gap-6">
        <h1 className="break-normal text-destructive text-4xl font-bold uppercase">
          Welcome to FBP
        </h1>
        <p>
          The Federal Bureau of Paranormal Activities exists to protect society
          from incursions originating in other dimensions. From isolated
          anomalous events to recurring contact patterns, we monitor, catalog,
          and respond to what conventional science still can't explain — before
          it reaches you.
        </p>
      </div>
      <div className="flex flex-col gap-6">
        <h1 className="break-normal text-destructive text-4xl font-bold uppercase">
          Who we are
        </h1>
        <p>
          We're an agency built by people who've already seen what shouldn't
          exist. Whether you have a history of paranormal contact, latent
          aptitude, or simply want to fight on the right side of that boundary,
          you're welcome here. Just find the old, forgotten building in downtown
          Manhattan — it knows you're coming before you knock.
        </p>
      </div>
      <div className="flex flex-col gap-6">
        <h1 className="break-normal text-destructive text-4xl font-bold uppercase">
          Tanstack Start and other tanstack components
        </h1>
        <p>
          Every FBP operation runs on a stack built for speed and reliability —
          because when paranormal activity is on the line, there's no time for
          slow loading. We use TanStack Start for SSR and routing, TanStack
          Query to sync field data in real time, and TanStack Form to handle
          agent intake and incident reporting without friction. A stack as
          precise as the instruments we use to measure aptitude.
        </p>
      </div>
      <div className="flex flex-col gap-6">
        <h1 className="break-normal text-destructive text-4xl font-bold uppercase">
          Statistic Inference with scikit-learn
        </h1>
        <p>
          Behind every recruited agent is a number: the paranormal aptitude
          level. We use scikit-learn to run multiple linear regression across
          biological, exposure, and origin-event variables, permutation tests to
          statistically validate which factors actually matter, and bootstrap
          resampling to generate robust confidence intervals around each
          prediction. We don't trust intuition — we trust inference.
        </p>
      </div>
    </div>
  )
}
