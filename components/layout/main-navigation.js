import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

const MainNavigation = () => {
  const { data: session, status } = useSession();
  if (status === "authenticated") {
    return (
      <h1>
        Login Already!<button onClick={signOut}>Sign Out</button>
      </h1>
    );
  }
  return (
    <ul>
      <li>
        <Link href="/auth/signin">Sign In</Link>
      </li>
      <li>
        <Link href="/auth/signup">Sign Up</Link>
      </li>
    </ul>
  );
};

export default MainNavigation;
