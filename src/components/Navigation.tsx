import Link from "next/link";
import { auth } from "@/auth";
import { signOut } from "@/auth";
import CartIcon from "@/components/cart/CartIcon";

export default async function Navigation() {
  const session = await auth();

  return (
    <nav className="relative z-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-cyan-400 hover:text-cyan-300"
            >
              COMPANYLOGO
            </Link>
          </div>

          {/* Center: Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link
              href="/"
              className="text-white hover:text-cyan-300 font-medium transition-colors text-sm xl:text-base"
            >
              HOME
            </Link>
            <Link
              href="/#about"
              className="text-white hover:text-cyan-300 font-medium transition-colors text-sm xl:text-base"
            >
              ABOUT
            </Link>
            <Link
              href="/products"
              className="text-white hover:text-cyan-300 font-medium transition-colors text-sm xl:text-base"
            >
              SHOP
            </Link>
            <Link
              href="/#contact"
              className="text-white hover:text-cyan-300 font-medium transition-colors text-sm xl:text-base"
            >
              CONTACT
            </Link>
          </div>

          {/* Right: Auth Buttons */}
          <div className="flex items-center space-x-4">
            <CartIcon />
            {session ? (
              <>
                <span className="text-white text-sm hidden sm:inline">
                  {session.user?.name || session.user?.email}
                </span>
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <button
                    type="submit"
                    className="text-white hover:text-cyan-300 font-medium transition-colors"
                  >
                    Sign Out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="bg-purple-400 text-white px-6 py-2 rounded-full hover:bg-purple-500 font-medium transition-colors"
                >
                  LOGIN
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-purple-800 text-white px-6 py-2 rounded-md hover:bg-purple-900 font-medium transition-colors"
                >
                  SIGN UP
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

