import { type Session } from "next-auth"
import { useSession } from "next-auth/react"
import { signIn as _signIn, signOut as _signOut } from "next-auth/react"

export interface SessionStateWrapperProps {
    Guest: (signIn: typeof _signIn) => JSX.Element
    User: (sessionData: Session, signOut: typeof _signOut) => JSX.Element
}

const SessionStateWrapper: React.FC<SessionStateWrapperProps> = ({
    Guest,
    User
}) => {
    const { data: sessionData } = useSession()

    if (!sessionData?.user) {
        return Guest(_signIn)
    }

    return User(sessionData, _signOut)
}

export default SessionStateWrapper