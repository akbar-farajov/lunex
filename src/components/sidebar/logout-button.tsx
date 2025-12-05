import { useTransition } from "react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { Loader2Icon, LogOutIcon } from "lucide-react";
import { logout } from "@/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const LogoutButton = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleLogout = async () => {
    startTransition(async () => {
      try {
        await logout();
        router.push("/");
      } catch (error) {
        toast.error((error as Error).message);
        console.error(error);
      }
    });
  };
  return (
    <DropdownMenuItem onClick={handleLogout}>
      {isPending ? <Loader2Icon /> : <LogOutIcon />}
      Log out
    </DropdownMenuItem>
  );
};
