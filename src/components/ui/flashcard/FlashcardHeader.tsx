import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Trash2, Pencil } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";

export const FlashcardHeader = ({
  title,
  description,
  onEdit,
  onDelete,
}: {
  title: string;
  description: string;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const router = useRouter();

  return (
    <div className="relative -mt-3 sm:-mt-5">
      <div className="flex gap-1 mb-10 mt-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-md p-2 mb-5 -ml-2 w-20 hover:bg-gray-800 text-gray-400"
        >
          <ArrowLeft className="h-5 w-5" /> Back
        </Button>
      </div>
      <div className="flex justify-between items-center gap-3 w-full">
        <div className="flex items-center">
          <h1 className="font-semibold text-lg">{title}</h1>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                <EllipsisVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 bg-gray-900 border-gray-700">
              <DropdownMenuItem
                onClick={onEdit}
                className="cursor-pointer focus:bg-gray-800"
              >
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDelete}
                className="cursor-pointer focus:bg-gray-800 text-red-400"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <p className="text-gray-300 max-w-170">{description}</p>
    </div>
  );
};
