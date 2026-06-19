import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/')({ component: Home })

function Home() {
  return (
    <div className="mx-6 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 mx-auto gap-6 w-fit">
        <div className="flex flex-col md:flex-row col-span-2 gap-6">
          <div className="flex flex-col">
            <h1 className="break-normal text-destructive text-4xl font-bold uppercase">
              Welcome to FBP
            </h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>

          <div className="flex flex-col">
            <h1 className="break-normal text-destructive text-4xl font-bold uppercase">
              Who we are
            </h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row col-span-2 gap-6">
          <div className="flex flex-col">
            <h1 className="break-normal text-destructive text-4xl font-bold uppercase">
              Tanstack
            </h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
          <div className="flex flex-col">
            <h1 className="break-normal text-destructive text-4xl font-bold uppercase">
              Statisc Inference
            </h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
