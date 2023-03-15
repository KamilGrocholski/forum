import { type Session } from "next-auth";
import { useSession } from "next-auth/react";
import { signIn as _signIn, signOut as _signOut } from "next-auth/react";

export interface SessionStateWrapperProps {
  // Guest: (signIn: typeof _signIn) => JSX.Element
  Guest: (signIn: () => void) => JSX.Element;
  User: (sessionData: Session, signOut: typeof _signOut) => JSX.Element;
}

const SessionStateWrapper: React.FC<SessionStateWrapperProps> = ({
  Guest,
  User,
}) => {
  const { data: sessionData } = useSession();

  const redirectToSignInPage = () => {
    void _signIn();
  };

  if (!sessionData?.user) {
    return Guest(redirectToSignInPage);
  }

  return User(sessionData, _signOut);
};

export default SessionStateWrapper;
