import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sparkles, Zap, Crown } from "lucide-react";
import { Button } from "./button";

const UpgradeToProDialog = ({
  openProDialog,
  setOpenProDialog,
}: {
  openProDialog: any;
  setOpenProDialog: any;
}) => {
  return (
    <Dialog open={openProDialog} onOpenChange={setOpenProDialog}>
      <DialogContent className="sm:max-w-[450px]   border border-blue-700 p-6 bg-gradient-to-b from-blue-900 to-black shadow-xl">
        <DialogHeader>
          <div className="flex items-center justify-center gap-3 mb-1">
            <Sparkles className="text-blue-400" />
            <DialogTitle className="text-white text-xl">
              Unlock Pro Features
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-300">
            You've reached the free tier limit. Upgrade to Pro for unlimited
            creation!
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Feature comparison */}
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div></div>
            <div className="text-center font-medium text-gray-300">Free</div>
            <div className="text-center font-medium text-blue-400">Pro</div>

            <div className="text-left">Flashcards</div>
            <div className="text-center">5 max</div>
            <div className="text-center text-green-400">Unlimited</div>

            <div className="text-left">Custom Texts</div>
            <div className="text-center">5 max</div>
            <div className="text-center text-green-400">Unlimited</div>

            <div className="text-left">Code Snippets</div>
            <div className="text-center">5 max</div>
            <div className="text-center text-green-400">Unlimited</div>

            <div className="text-left">Ad-Free</div>
            <div className="text-center text-red-400">No</div>
            <div className="text-center text-green-400">Yes</div>
          </div>

          {/* Special offer highlight */}
          <div className="mt-4 p-3 bg-blue-900/30 rounded-lg border border-blue-700/50">
            <div className="flex items-center gap-2">
              <Zap className="text-yellow-400 size-4" />
              <span className="font-medium text-white">Early Access Deal</span>
            </div>
            <p className="text-sm text-blue-200 mt-1">
              Get lifetime access for just $9.99. Price will increase soon!
            </p>
          </div>
        </div>

        <DialogFooter className="gap-3">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="cursor-pointer border-gray-600 hover:bg-gray-800"
            >
              Maybe Later
            </Button>
          </DialogClose>
          <Button
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => {
              window.location.href = "/payment";
            }}
          >
            <Crown className="mr-2 size-4" />
            Upgrade to Pro
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeToProDialog;
