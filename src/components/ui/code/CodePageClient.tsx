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
import { cn } from "@/lib/utils";
import { deleteCode, getCode } from "../../../../utils/code/codeUtils";
import { editCode } from "../../../../utils/code/codeUtils";
import CodeTyping from "../typing/CodeTyping";
import CodeTypingId from "./CodeTypingId";
import SkeletonCode from "./SkeletonCode";

const CodePageClient = ({ slug }: { slug: string }) => {
  const router = useRouter();
  const { user } = useAuth();
  const id = slug.split("-")[0];
  const { showWpm, setShowWpm } = useWpm();
  const [codeData, setCodeData] = useState<any>({
    title: "",
    description: "",
    language: "",
    code: "",
    time_complexity: "",
    space_complexity: "",
    difficulty: "",
  });
  const [copyCodeData, setCopyCodeData] = useState<any>({
    title: "",
    description: "",
    language: "",
    code: "",
    time_complexity: "",
    space_complexity: "",
    difficulty: "",
  });
  const [loading, setLoading] = useState(true);
  const [openEditCode, setOpenEditCode] = useState(false);
  const [openConfrmDelete, setOpenConfirmDelete] = useState(false);

  const handleEditText = async () => {
    if (!copyCodeData.title || !copyCodeData.code) {
      toast.warning("Please make sure text have title and an typing code.");
      return;
    }

    try {
      const { data, error } = await editCode({
        id: id,
        title: copyCodeData.title,
        description: copyCodeData.description,
        code: copyCodeData.code,
        created_at: copyCodeData.created_at,
        user_id: user?.id,
      });

      if (error) {
        toast.error("Failed to update code: " + error);
      } else {
        toast.success("Code updated successfully!");

        let updatedData = {
          title: data.title,
          description: data.description,
          code: data.code,
        };
        setCodeData(updatedData);
        setCopyCodeData(updatedData);
        router.refresh();
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    }

    setOpenEditCode(false);
  };

  const handleDeleteText = async () => {
    try {
      const { error } = await deleteCode(id);

      if (error) {
        toast.error("Failed to delete code: " + error);
      } else {
        toast.success("Code deleted successfully!");
        router.push("/dashboard"); // Redirect after deletion
      }

      router.back();
    } catch (err) {
      toast.error("An unexpected error occurred");
    }
  };

  useEffect(() => {
    const fetchCode = async () => {
      if (user?.id) {
        setLoading(true);
        const { data } = await getCode(id);

        let fetchedData = {
          title: data.title,
          description: data.description,
          code: data.code,
          language: data.language,
          time_complexity: data.time_complexity,
          space_complexity: data.space_complexity,
          difficulty: data.difficulty,
        };

        setCodeData(fetchedData);
        setCopyCodeData(fetchedData);
        setLoading(false);
      }
    };
    fetchCode();
  }, [user, id]);

  // Style Difficulty
  const styleDifficulty = (difficulty: any) => {
    difficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    if (difficulty == "Easy") {
      return (
        <div className="bg-gray-900 text-green-300 px-2 w-auto flex items-center justify-center text-sm rounded-full p-1">
          {difficulty}
        </div>
      );
    } else if (difficulty == "Medium") {
      return (
        <div className="bg-gray-900 text-orange-300 px-2 w-auto flex items-center justify-center text-sm rounded-full p-1">
          {difficulty}
        </div>
      );
    } else {
      return (
        <div className="bg-gray-900 text-red-300 px-2 w-auto flex items-center justify-center text-sm rounded-full p-1">
          {difficulty}
        </div>
      );
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto px-2 sm:px-5 mb-20 relative overflow-hidden">
      <Toaster position="top-center" />
      {!loading ? (
        <div>
          <Dialog open={openConfrmDelete} onOpenChange={setOpenConfirmDelete}>
            <DialogContent className="max-w-[400px]">
              <DialogHeader>
                <DialogTitle className="text-lg">Delete Code</DialogTitle>
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

          <Dialog open={openEditCode} onOpenChange={setOpenEditCode}>
            <DialogContent
              onOpenAutoFocus={(e) => e.preventDefault()}
              className="!max-w-[750px] w-full h-[80vh] flex flex-col"
            >
              <DialogHeader className="">
                <DialogTitle className="text-xl font-semibold text-center">
                  Edit Code
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-400"></DialogDescription>
              </DialogHeader>

              <div className="mt-4 px-2  flex flex-col gap-5 overflow-scroll  ">
                <div className="my-3 h-full  flex flex-col gap-5">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Enter title"
                      required
                      className="input-glow !bg-gray-900 !border-0"
                      value={copyCodeData.title}
                      onChange={(e) => {
                        setCopyCodeData((prev: any) => ({
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
                      value={copyCodeData.typingText}
                      onChange={(e) => {
                        setCopyCodeData((prev: any) => ({
                          ...prev,
                          typingText: e.target.value,
                        }));
                      }}
                    />
                  </div>

                  <div className="text-gray-500">
                    {copyCodeData.code.length} characters -
                    <span
                      className={cn(
                        "text-gray-500",
                        copyCodeData.code.length > 1000 && "text-red-400"
                      )}
                    >
                      Max 1000 characters
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <Button
                    onClick={() => {
                      setOpenEditCode(false);
                    }}
                    className="bg-gray-900/20 hover:bg-gray-800 text-gray-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={copyCodeData.code.length > 1000}
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
                      onClick={() => setOpenEditCode(true)}
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

            {/* Code Information */}
            <div className="pl-2 flex items-center">
              <div className="my-3">
                <h1 className="mb-3 font-medium text-lg md:text-2xl lg:text-[1.7em]">
                  {codeData?.title}
                </h1>
                <div className="flex items-center flex-wrap gap-2 mb-3">
                  {codeData?.difficulty
                    ? styleDifficulty(codeData?.difficulty)
                    : ""}

                  {codeData.time_complexity && (
                    <div className="bg-gray-900 text-blue-300 w-auto px-3 flex items-center justify-center text-sm rounded-full p-1">
                      Time Complexity: {codeData?.time_complexity}
                    </div>
                  )}

                  {codeData.space_complexity && (
                    <div className="bg-gray-900 text-blue-300 w-auto px-3 flex items-center justify-center text-sm rounded-full p-1">
                      Space Complexity: {codeData?.space_complexity}
                    </div>
                  )}
                </div>
                <p className="text-sm md:text-base mt-1 max-w-4xl text-gray-300">
                  {codeData?.description}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:pr-20">
            <CodeTyping
              text={codeData.code}
              title={codeData.title}
              description={codeData.description}
              difficulty={codeData.difficulty}
              timeComplexity={codeData.time_complexity}
              spaceComplexity={codeData.space_complexity}
            />
          </div>
        </div>
      ) : (
        <div>
          <SkeletonCode />
        </div>
      )}
    </div>
  );
};

export default CodePageClient;
