import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { LogOut, MessagesSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();

  return (
    <header className="border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex justify-between items-center h-full">
          <Link
            aria-label="Go to home"
            to="/"
            className="flex items-center gap-2.5 hover:opacity-80 transition-all"
          >
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessagesSquare className="w-5.h-5 text-primary" />
            </div>
            <h1 className="text-lg font-bold">Gossip</h1>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              aria-label="Go to settings"
              to="/settings"
              className={`btn btn-sm gap-2 transition-colors`}
            >
              <Settings className="size-4" />
              <div className="hidden sm:inline">Settings</div>
            </Link>
            {authUser && (
              <>
                <Link
                  to="/profile"
                  className="btn btn-sm gap-2"
                  aria-label="Go to profile"
                >
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <button
                  className="flex gap-2 items-center"
                  onClick={logout}
                  aria-labelledby="Logout button"
                  aria-label="Logout"
                >
                  <LogOut className="size-5" role="button" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
