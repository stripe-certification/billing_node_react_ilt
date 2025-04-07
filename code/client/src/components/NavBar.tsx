import { useUserContext } from "@/contexts/UserContext";
import { Disclosure } from "@headlessui/react";
import Link from "next/link";
import Logo from "./ui/Logo";
import { useRouter } from "next/navigation";
export default function NavBar() {
  const { isLoggedIn, hasActiveSubscription, logout, userLoading } = useUserContext();
  const router = useRouter();
  return (
    <Disclosure as="nav" className="bg-background">
      <div className="mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex-1 flex items-center justify-start"></div>

          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-shrink-0 items-center">
              <Link href={`/`} className="flex items-center justify-center">
                <Logo />
              </Link>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-end z-20">
            {(!userLoading && isLoggedIn()) ? (
              <>
                {hasActiveSubscription() && (
                  <div className="flex flex-row">
                    <Link
                      href={`/account`}
                      type="button"
                      className="rounded-full bg-background p-1 mr-5 text-text-color"
                    >
                      <span>Account</span>
                    </Link>
                    <Link
                      href={`/chat`}
                      type="button"
                      className="rounded-full bg-background p-1 mr-5 text-text-color"
                    >
                      <span>Chat</span>
                    </Link>
                  </div>
                )}

                <button
                  onClick={async () => {
                    try {
                      await logout();
                      router.push("/");
                    } catch (error) {
                      console.error("Logout failed:", error);
                    }
                  }}
                  className="rounded-full bg-background p-1 text-text-color"
                >
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                href={`/auth/sign-in`}
                type="button"
                className="rounded-full bg-background p-1 text-text-color"
              >
                <span>Log In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </Disclosure>
  );
}
