"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useWpm } from "@/app/context/WpmContext";
import { getText } from "../../../../utils/text/textUtils";
import { Button } from "../button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, Pencil, Trash2, EllipsisVertical } from "lucide-react";
import StandardTyping from "../typing/StandardTyping";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "../textarea";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { copyTracedFiles } from "next/dist/build/utils";
import { editText } from "../../../../utils/text/textUtils";
import { cn } from "@/lib/utils";
import { deleteText } from "../../../../utils/text/textUtils";
import TextSkeleton from "./TextSkeleton";

const TextPageClient = ({ slug }: { slug: string }) => {
  const router = useRouter();
  const { user } = useAuth();
  const id = slug.split("-")[0];
  const { showWpm, setShowWpm } = useWpm();
  const [textData, setTextData] = useState<any>({
    title: "",
    typingText: "",
  });
  const [copytextData, setCopyTextData] = useState<any>({
    title: "",
    typingText: "",
  });
  const [loading, setLoading] = useState(true);
  const [openEditText, setOpenEditText] = useState(false);
  const [openConfrmDelete, setOpenConfirmDelete] = useState(false);

  const handleEditText = async () => {
    if (!copytextData.title || !copytextData.typingText) {
      toast.warning("Please make sure text have title and an typing text.");
      return;
    }

    try {
      const { data, error } = await editText({
        id: id,
        title: copytextData.title,
        typingText: copytextData.typingText,
      });

      if (error) {
        toast.error("Failed to update text: " + error);
      } else {
        toast.success("Text updated successfully!");

        let updatedData = {
          title: data.title,
          typingText: data.typingText,
        };
        setTextData(updatedData);
        setCopyTextData(updatedData);
        router.refresh();
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    }

    setOpenEditText(false);
  };

  const handleDeleteText = async () => {
    try {
      const { error } = await deleteText(id); // You'll need to implement deleteText in your textUtils

      if (error) {
        toast.error("Failed to delete text: " + error);
      } else {
        toast.success("Text deleted successfully!");
        router.push("/texts"); // Redirect after deletion
      }

      router.back();
    } catch (err) {
      toast.error("An unexpected error occurred");
    }
  };

  useEffect(() => {
    const fetchText = async () => {
      if (user?.id) {
        setLoading(true);
        const { data } = await getText(id);
        let fetchedData = {
          title: data.title,
          typingText: data.typingText,
        };

        setTextData(fetchedData);
        setCopyTextData(fetchedData);
        setLoading(false);
      }
    };
    fetchText();
  }, [user, id]);

  return (
    <div className="max-w-[1000px] mx-auto px-2 sm:px-5 mb-20 relative overflow-hidden">
      <Toaster position="top-center" />
      {!loading ? (
        <div>
          <Dialog open={openConfrmDelete} onOpenChange={setOpenConfirmDelete}>
            <DialogContent className="max-w-[400px]">
              <DialogHeader>
                <DialogTitle className="text-lg">Delete Text</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. The text will be permanently
                  deleted and removed from your library.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-3 mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpenConfirmDelete(false);
                  }}
                  className="text-gray-200 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    handleDeleteText();
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={openEditText} onOpenChange={setOpenEditText}>
            <DialogContent
              onOpenAutoFocus={(e) => e.preventDefault()}
              className="!max-w-[750px] w-full h-[80vh] flex flex-col"
            >
              <DialogHeader className="">
                <DialogTitle className="text-xl font-semibold text-center">
                  Edit Text
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-400"></DialogDescription>
              </DialogHeader>

              <div className="mt-4 px-2  flex flex-col gap-5 overflow-scroll  ">
                <div className="my-3 h-full  flex flex-col gap-5">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="email">Title</Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Enter title"
                      required
                      className="input-glow !bg-gray-900 !border-0"
                      value={copytextData.title}
                      onChange={(e) => {
                        setCopyTextData((prev: any) => ({
                          ...prev,
                          title: e.target.value,
                        }));
                      }}
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <Label htmlFor="email">Typing Text </Label>
                    <Textarea
                      id="typingText"
                      placeholder="Enter typing text"
                      className="input-glow !bg-gray-900 !border-0 leading-normal"
                      value={copytextData.typingText}
                      onChange={(e) => {
                        setCopyTextData((prev: any) => ({
                          ...prev,
                          typingText: e.target.value,
                        }));
                      }}
                    />
                  </div>

                  <div className="text-gray-500">
                    {copytextData.typingText.length} characters -
                    <span
                      className={cn(
                        "text-gray-500",
                        copytextData.typingText.length > 500 && "text-red-400"
                      )}
                    >
                      Max 500 characters
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <Button
                    onClick={() => {
                      setOpenEditText(false);
                    }}
                    className="bg-gray-900/20 hover:bg-gray-800 text-gray-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={copytextData.typingText.length > 500}
                    onClick={handleEditText}
                    className="text-blue-400 bg-blue-950/30 hover:bg-blue-950/70"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div className="my-3 x-auto flex flex-col mb-15">
            <div className="flex justify-between gap-3 w-full">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="rounded-md p-2 -ml-2 w-20 hover:bg-gray-800 text-gray-400"
              >
                <ArrowLeft className="h-5 w-5" /> Back
              </Button>

              <div>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowWpm(!showWpm);
                  }}
                  variant="ghost"
                  className={cn(
                    "text-gray-400 hover:text-white",
                    showWpm && "text-blue-400 hover:text-blue-400"
                  )}
                >
                  WPM
                </Button>

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
                      onClick={() => setOpenEditText(true)}
                      className="cursor-pointer focus:bg-gray-800"
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setOpenConfirmDelete(true)}
                      className="cursor-pointer focus:bg-gray-800 text-red-400 "
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="flex items-center">
              <h1 className="font-semibold text-lg mt-3">{textData.title}</h1>
            </div>
          </div>

          <StandardTyping text={textData.typingText} />
        </div>
      ) : (
        <TextSkeleton />
      )}
    </div>
  );
};

export default TextPageClient;
