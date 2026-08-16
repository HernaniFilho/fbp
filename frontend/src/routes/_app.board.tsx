import { Tabs, TabsList, TabsTrigger } from '#/components/ui/tabs'
import EvaluateStaffMembers from '#/features/board/components/evaluateSatffMembers'
import { MissionAllList } from '#/features/board/components/missonsAllList'
import { createFileRoute } from '@tanstack/react-router'
import { Activity, useState } from 'react'

export const Route = createFileRoute('/_app/board')({
  component: RouteComponent,
})

function RouteComponent() {
  const [currentTab, setCurrentTab] = useState('staff')

  return (
    <div className="mx-6 mt-6 flex flex-col gap-6">
      <Tabs
        value={currentTab}
        onValueChange={setCurrentTab}
        orientation="horizontal"
      >
        <TabsList variant="line">
          <TabsTrigger value="staff" className="font-semibold">
            Staff Members
          </TabsTrigger>
          {/*
          <TabsTrigger value="missions" className="font-semibold">
            Missions
          </TabsTrigger>
          */}
        </TabsList>
      </Tabs>

      <div className="flex-1">
        <Activity mode={currentTab === 'staff' ? 'visible' : 'hidden'}>
          <div className="flex flex-col gap-2">
            <h2 className="self-center text-center text-primary text-5xl md:text-6xl break-normal font-bold uppercase">
              Staff paranormal evaluation
            </h2>
            <p className="self-center text-muted-foreground text-justify mb-4">
              Evaluate the staff members paranormal level so you can make
              informed decisions about their activity on missions.
            </p>
            <EvaluateStaffMembers />
          </div>
        </Activity>
        {/*
        <Activity mode={currentTab === 'missions' ? 'visible' : 'hidden'}>
          <div className="flex flex-col gap-2">
            <h2 className="self-center text-center text-primary text-5xl md:text-6xl break-normal font-bold uppercase">
              Missions Available
            </h2>
            <p className="self-center text-muted-foreground text-justify mb-4">
              View the missions available for your team.
            </p>
            <MissionAllList />
          </div>
        </Activity>
        */}
      </div>
    </div>
  )
}
