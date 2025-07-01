"use client";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUp, Type, Link, X, Pencil, MessageSquareText } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import StandardTyping from "@/components/ui/typing/StandardTyping";
import { useEditText } from "@/app/context/AddTextContext";

const Story = () => {
  const { openAddText, setOpenAddText } = useEditText();

  const [activeTab, setActiveTab] = useState("write");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");

  //Typing
  const [isCode, setIsCode] = useState(false);

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
    // Handle submission logic here
    console.log("Submitted:", { text, file, url });
    setText(text);
    setOpenAddText(false);
  };

  return (
    <div className="relative flex flex-col">
      {/* Custom Settings */}
      <div>
        <Dialog open={openAddText} onOpenChange={setOpenAddText}>
          {/* <DialogTrigger>
      
          </DialogTrigger> */}
          <DialogContent className="!max-w-[750px] w-full ">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
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
                    "flex items-center gap-2 bg-blue-950/30 ",
                    activeTab === "write" && "text-blue-400"
                  )}
                >
                  <Type className="h-4 w-4" /> Write
                </TabsTrigger>
                <TabsTrigger
                  value="upload"
                  className={cn(
                    "flex items-center gap-2",
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

                <div className="mt-2 text-xs text-gray-500">
                  {text.length} characters -{" "}
                  <span
                    className={cn(
                      "text-gray-500",
                      text.length > 500 && "text-red-400"
                    )}
                  >
                    Max 500 characters
                  </span>
                </div>
              </TabsContent>

              <TabsContent value="upload" className="mt-4">
                <div className="border-2 border-dashed border-blue-300/60 rounded-lg p-6 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileUp className="h-8 w-8 text-gray-400" />
                    <p className="text-sm font-medium">Upload a text file</p>
                    <p className="text-xs text-gray-500">Supports .txt files</p>
                    <Input
                      type="file"
                      accept=".txt,text/plain"
                      onChange={handleFileUpload}
                      className="mt-4 w-full max-w-xs"
                    />
                    {file && (
                      <div className="mt-4 flex items-center gap-2 bg-gray-100 p-2 rounded">
                        <span className="text-sm">{file.name}</span>
                        <button onClick={() => setFile(null)}>
                          <X className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                disabled={!file && (text.length === 0 || text.length > 500)}
                onClick={() => setOpenAddText(false)}
                className="bg-gray-900/20 hover:bg-gray-800 text-gray-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!file && (text.length === 0 || text.length > 500)}
                className="text-blue-400 bg-blue-950/30 hover:bg-blue-950/70"
              >
                Add Text
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {!openAddText && text.length > 0 ? (
        <div>
          <StandardTyping text={text} />
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
            className="text-blue-400 bg-blue-950/30 hover:bg-blue-950/70 md:mt-3 md:scale-105"
          >
            Add Text
          </Button>
        </div>
      )}
    </div>
  );
};

export default Story;
