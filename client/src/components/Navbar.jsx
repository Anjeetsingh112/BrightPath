import { Menu, School } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { useEffect } from "react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import DarkMode from "@/DarkMode";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);

  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "User log Out.");
      navigate("/login");
    }
  }, [isSuccess]);

  const logoutHandler = async () => {
    await logoutUser();
  };
  return (
    <div className="h-16 dark:bg-[#020817] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10">
      {/* Desktop */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full">
        <Link to="/">
        <div className="flex items-center gap-2">
          <School size={"30"} />
          <div>
           
            <h1 className="hidden md:block font-extrabold text-2xl">
              BrightPath
            </h1>
           
          </div>
        </div>
       </Link>
        <div className="flex items-center gap-8">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage
                    src={
                      user?.photoUrl ||
                      "https://img.freepik.com/free-photo/front-view-modern-boy-with-sunglasses-posing_23-2148423101.jpg"
                    }
                    alt="@shadcn"
                    className="object-cover"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link to="my-learning"> My learning</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="profile"> Edit Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logoutHandler}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                {user?.role === "instructor" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={()=> navigate("/admin/dashboard")} >Dashboard</DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button onClick={() => navigate("/login")} variant="outline">
                Login
              </Button>
              <Button onClick={() => navigate("/login")}>Signup</Button>
            </div>
          )}
        <DarkMode/>
        </div>
      </div>
      {/* Mobile device  */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <Link to='/'>
        <h1 className="font-extrabold text-2xl">BrightPath</h1>
        </Link>
        <MobileNavbar user={user} />
      </div>
    </div>
  );
};

export default Navbar;
const MobileNavbar = ({user}) => {
  const navigate = useNavigate();
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  
  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "User log Out.");
      navigate("/login");
    }
  }, [isSuccess]);

  const logoutHandler = async () => {
    await logoutUser();
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="rounded-full hover:bg-gray-200"
          variant="outline"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <SheetTitle> <Link to="/">BrightPath</Link></SheetTitle>
          <DarkMode />
        </SheetHeader>
        <Separator className="mr-2" />
        <nav className="flex flex-col space-y-4">
          <Link to="/my-learning">My Learning</Link>
          <Link to="/profile">Edit Profile</Link>
          <p className="cursor-pointer" onClick={logoutHandler}>Log out</p>
        </nav>
        {user?.role === "instructor" && (
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit" onClick={()=> navigate("/admin/dashboard")}>Dashboard</Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};