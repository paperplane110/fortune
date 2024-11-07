import { UserButton } from "@clerk/nextjs"
import { HeaderLogo } from "./header-logo"
import { Navigation } from "./navigation"
import { WelcomeMsg } from "./welcome-msg"
import { ClerkLoading, ClerkLoaded } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"

export const Header = () => {
  return (
    <header className="bg-gradient-to-b from-orange-700 to-yellow-500 px-4 py-8 lg:px-14 pb-36">
      <div className="max-w-screen-2xl mx-auto">
        <div className="w-full flex items-center justify-between mb-14">
          <div className="flex items-center lg:gap-x-16">
            <HeaderLogo />
            <Navigation />
          </div>
          <ClerkLoading>
            <Loader2 className="size-8 animate-spin text-white" />
          </ClerkLoading>
          <ClerkLoaded>
            <UserButton />
          </ClerkLoaded>
        </div>
        <WelcomeMsg />
      </div>
    </header>
  )
}