import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenu,
} from "./ui/dropdown-menu";
import { useNavigate } from "@tanstack/react-router";

export const TenantSelector = ({ selected }: { selected: string }) => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="hidden border-blue-500 text-blue-600 hover:bg-blue-50 sm:inline-flex dark:hover:bg-blue-900/20"
        >
          {selected}
          <ChevronDown className="ml-1 h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => navigate({ to: "/" })}
          className="cursor-pointer"
        >
          Web Utama
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate({ to: "/runa" })}
          className="cursor-pointer font-medium text-blue-600"
        >
          Runa Store
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
