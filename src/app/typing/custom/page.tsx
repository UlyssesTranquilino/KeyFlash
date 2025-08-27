"use client";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileUp,
  Type,
  Link,
  X,
  Pencil,
  MessageSquareText,
  CodeXml,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { cn } from "@/lib/utils";
import StandardTyping from "@/components/ui/typing/StandardTyping";
import { useEditText } from "@/app/context/AddTextContext";
import CodeTyping from "@/components/ui/typing/CodeTyping";
import { useAuth } from "@/app/context/AuthContext";

const Story = () => {
  const { openAddText, setOpenAddText } = useEditText();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("write");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");

  //Typing
  const [isCode, setIsCode] = useState(false);
  const [text, setText] = useState(() => {
    if (typeof window != "undefined") {
      const saved = localStorage.getItem("savedText");
      return saved || "";
    }

    return "";
  });

  // Save to localStorage whenever text changes
  useEffect(() => {
    localStorage.setItem("savedText", text);
  }, [text]);

  // Save code mode preference
  useEffect(() => {
    const savedMode = localStorage.getItem("isCodeMode");
    setIsCode(savedMode === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("isCodeMode", String(isCode));
  }, [isCode]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploadedFile = e.target.files[0];
      if (
        uploadedFile.type === "text/plain" ||
        uploadedFile.name.endsWith(".txt")
      ) {
        setFile(uploadedFile);
        // Read file content
        const reader = new FileReader();
        reader.onload = (event) => {
          setText((event.target?.result as string) || "");
        };
        reader.readAsText(uploadedFile);
      } else {
        alert("Please upload a .txt file");
      }
    }
  };

  const handleSubmit = () => {
    setText(text);
    setOpenAddText(false);
  };

  const clearSavedText = () => {
    setText("");
    localStorage.removeItem("savedText");
    setOpenAddText(false);
  };

  return (
    <div className="h-screen relative flex flex-col">
      {/* Custom Settings */}
      <div>
        <Dialog open={openAddText} onOpenChange={setOpenAddText}>
          {/* <DialogTrigger>
      
          </DialogTrigger> */}
          <DialogContent className="!max-w-[750px] w-full ">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-center">
                Add Your Text Content
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                Choose how you want to add text - write directly or upload a
                file
              </DialogDescription>
            </DialogHeader>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mt-4 "
            >
              <TabsList className="grid w-full grid-cols-2 bg-blue-950/30">
                <TabsTrigger
                  value="write"
                  className={cn(
                    "cursor-pointer flex items-center gap-2 bg-blue-950/30 ",
                    activeTab === "write" && "text-blue-400"
                  )}
                >
                  <Type className="h-4 w-4" /> Write
                </TabsTrigger>
                <TabsTrigger
                  value="upload"
                  className={cn(
                    "cursor-pointer flex items-center gap-2",
                    activeTab === "upload" && "text-blue-400"
                  )}
                >
                  <FileUp className="h-4 w-4" /> Upload
                </TabsTrigger>
              </TabsList>

              <TabsContent value="write" className="mt-4">
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type or paste your text here..."
                  className="min-h-[200px] max-h-[300px] !bg-gray-950/30 md:text-[15px]"
                  // maxLength={600}
                />

                <div className="mt-2 text-xs  flex items-center justify-between">
                  <div className="text-gray-500">
                    {text.length} characters -
                    <span
                      className={cn(
                        "text-gray-500",
                        text.length > 350 && "text-red-400"
                      )}
                    >
                      Max 350 characters
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-300">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2 cursor-pointer">
                          <Switch
                            id="code-toggle"
                            checked={isCode}
                            onCheckedChange={setIsCode}
                            className={cn(
                              "scale-80",
                              "data-[state=checked]:bg-blue-300",
                              "data-[state=checked]:border-blue-300",
                              "data-[state=checked]:ring-blue-300"
                            )}
                          />
                          <Label
                            htmlFor="code-toggle"
                            className="text-sm flex items-center gap-2"
                          >
                            Code
                            <CodeXml />
                          </Label>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" align="center">
                        <p>Display text as code format</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="upload" className="mt-4">
                <div className="border-2 border-dashed border-blue-300/60 rounded-lg p-3 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileUp className="h-8 w-8 text-gray-400" />
                    <p className="text-sm font-medium">Upload a text file</p>
                    <p className="text-xs text-gray-500">Supports .txt files</p>
                    <Input
                      type="file"
                      accept=".txt,text/plain"
                      onChange={handleFileUpload}
                      className="mt-4 w-full max-w-54"
                    />
                    {file && (
                      <div className="flex flex-col items-center gap-2 p-2 rounded w-full">
                        {/* <span className="text-sm">{file.name}</span> */}
                        {/* <button onClick={() => setFile(null)}>
                          <X className="h-4 w-4 text-gray-500" />
                        </button> */}
                        <Textarea
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          placeholder="Type or paste your text here..."
                          className="min-h-[100px] max-h-[170px] !bg-gray-950/30 md:text-[15px] w-full"
                          // maxLength={600}
                        />

                        <div className="mt-2 text-xs  flex items-center justify-between w-full">
                          <div className="text-gray-500">
                            {text.length} characters -
                            <span
                              className={cn(
                                "text-gray-500",
                                text.length > 350 && "text-red-400"
                              )}
                            >
                              Max 350 characters
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-blue-300">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-2 cursor-pointer">
                                  <Switch
                                    id="code-toggle"
                                    checked={isCode}
                                    onCheckedChange={setIsCode}
                                    className={cn(
                                      "scale-80",
                                      "data-[state=checked]:bg-blue-300",
                                      "data-[state=checked]:border-blue-300",
                                      "data-[state=checked]:ring-blue-300"
                                    )}
                                  />
                                  <Label
                                    htmlFor="code-toggle"
                                    className="text-sm flex items-center gap-2"
                                  >
                                    Code
                                    <CodeXml />
                                  </Label>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="top" align="center">
                                <p>Display text as code format</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                // disabled={text.length === 0 || text.length > 500}
                onClick={() => {
                  setOpenAddText(false);
                  clearSavedText();
                }}
                className="cursor-pointer bg-gray-900/20 hover:bg-gray-800 text-gray-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={text.length === 0 || text.length > 350}
                className="cursor-pointer text-blue-400 bg-blue-950/30 hover:bg-blue-950/70"
              >
                Add Text
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {!openAddText && text.length > 0 ? (
        <div>
          {isCode ? (
            <div>
              <CodeTyping text={text} sessionType="single" />
            </div>
          ) : (
            <StandardTyping text={text} />
          )}
        </div>
      ) : (
        <div className="mt-15 flex flex-col items-center justify-center gap-4 p-8 rounded-xl border border-dashed border-blue-300/40 bg-blue-950/10 text-center shadow-inner">
          <MessageSquareText className="h-10 w-10 md:scale-105 text-blue-400" />
          <div className="flex flex-col gap-2 md:scale-110 md:mt-1">
            <h3 className="text-lg font-semibold text-white">
              No text added yet
            </h3>
            <p className="text-sm text-gray-400">
              Click the button below to add your text content
            </p>
          </div>
          <Button
            onClick={() => setOpenAddText(true)}
            className="cursor-pointer text-blue-400 bg-blue-950/30 hover:bg-blue-950/70 md:mt-3 md:scale-105"
          >
            Add Text
          </Button>
        </div>
      )}
    </div>
  );
};

export default Story;
