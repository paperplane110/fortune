import { Header } from "@/components/header"
import { Suspense } from "react"

type Props = {
  children: React.ReactNode
}

const DashboardLayout = ({ children }: Props) => {
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <main className="px-3 lg:px-14">
        {children}
      </main>
    </>
  )
}

export default DashboardLayout