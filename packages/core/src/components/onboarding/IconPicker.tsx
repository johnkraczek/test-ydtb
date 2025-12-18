"use client";

import { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@ydtb/ui/base/dialog";
import { Button } from "@ydtb/ui/base/button";
import { Input } from "@ydtb/ui/base/input";
import { Label } from "@ydtb/ui/base/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ydtb/ui/base/select";
import { ScrollArea } from "@ydtb/ui/base/scroll-area";
import { Avatar } from "@ydtb/ui/base/avatar";
import { Slider } from "@ydtb/ui/base/slider";
import { Search, Upload, LayoutDashboard } from "lucide-react";
import { cn } from "@ydtb/core/lib/utils";
import { WorkspaceData, CropArea } from "./types";
import { ICON_LIST, COLORS } from "./constants";
import { getCroppedImg, getColorClasses } from "./utils";
import { WorkspaceIcon } from "./WorkspaceIcon";

interface IconPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: WorkspaceData;
  updateData: (updates: Partial<WorkspaceData>) => void;
}

export function IconPicker({ open, onOpenChange, data, updateData }: IconPickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
  const [colorTarget, setColorTarget] = useState<"icon" | "background">("icon");
  const [iconSearch, setIconSearch] = useState("");

  const filteredIcons = ICON_LIST.filter(i =>
    i.name.toLowerCase().includes(iconSearch.toLowerCase())
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSaveCrop = async () => {
    if (imageSrc && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        updateData({ icon: croppedImage, iconType: "image" });
        setIsCropping(false);
        onOpenChange(false);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleCancelCrop = () => {
    setIsCropping(false);
    setImageSrc(null);
  };

  const handleIconSelect = (iconName: string) => {
    // Clear image state when switching to icon
    setImageSrc(null);
    setCroppedAreaPixels(null);
    updateData({ icon: iconName, iconType: "lucide" });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          onOpenChange(false);
          // Reset cropping state if closed
          setTimeout(() => {
            setIsCropping(false);
            setImageSrc(null);
          }, 300);
        } else {
          onOpenChange(true);
        }
      }}
    >
      <DialogContent className={cn(
        "transition-all duration-300 sm:max-w-3xl",
        isCropping ? "sm:max-w-3xl" : "sm:max-w-2xl"
      )}>
        <DialogHeader>
          <DialogTitle>{isCropping ? "Crop Workspace Icon" : "Choose Workspace Icon"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6 py-4 min-h-[400px]">
          {/* Left: Icon Grid or Back Button */}
          <div className={cn(
            "flex flex-col gap-4 transition-all duration-300",
            isCropping ? "w-full md:w-1/3" : "flex-1"
          )}>
            {!isCropping && (
              <div className="flex items-start gap-6 p-2 mb-2 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex flex-col items-center justify-center">
                  <Avatar className="h-24 w-24 border-2 border-white shadow-sm bg-white">
                    <WorkspaceIcon data={data} size="xl" />
                  </Avatar>
                </div>

                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Color Theme</Label>
                    <Select value={colorTarget} onValueChange={(v) => setColorTarget(v as "icon" | "background")}>
                      <SelectTrigger className="w-[110px] h-7 text-xs bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="icon">Icon Color</SelectItem>
                        <SelectItem value="background">Background</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {COLORS.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => updateData(colorTarget === "icon" ? { iconColor: c.value } : { backgroundColor: c.value })}
                        className={cn(
                          "w-6 h-6 rounded-full transition-all border border-slate-200",
                          getColorClasses(c.value).bg,
                          (colorTarget === "icon" ? data.iconColor : data.backgroundColor) === c.value
                            ? "ring-2 ring-offset-2 ring-slate-400 scale-110"
                            : "hover:scale-110 opacity-90 hover:opacity-100"
                        )}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Choose Icon</div>

            {isCropping ? (
              // Back to Icons Button (similar style to upload box)
              <div
                className="flex-1 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center gap-4 hover:border-indigo-500 hover:bg-slate-50 transition-colors cursor-pointer p-6 text-center"
                onClick={handleCancelCrop}
              >
                <div className="h-12 w-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                  <LayoutDashboard className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Choose Icon</p>
                  <p className="text-xs text-slate-500 mt-1">Select from library</p>
                </div>
              </div>
            ) : (
              // Icon Grid
              <div className="flex-1 flex flex-col min-h-0">
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search icons..."
                      value={iconSearch}
                      onChange={(e) => setIconSearch(e.target.value)}
                      className="pl-9 h-9"
                    />
                  </div>
                </div>

                <ScrollArea className="h-[220px] border border-slate-200 rounded-lg p-4">
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                    {filteredIcons.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => handleIconSelect(item.name)}
                        className={cn(
                          "flex items-center justify-center p-3 rounded-lg border-2 hover:bg-slate-50 transition-all aspect-square",
                          data.iconType === "lucide" && data.icon === item.name
                            ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                            : "border-slate-100 text-slate-500 hover:border-slate-300"
                        )}
                      >
                        <item.icon className="h-6 w-6" />
                      </button>
                    ))}
                    {filteredIcons.length === 0 && (
                      <div className="col-span-full text-center py-4 text-sm text-slate-400">
                        No icons found
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="hidden md:flex flex-col items-center justify-center">
            <div className="w-px h-full bg-slate-200 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white py-2 text-slate-400 text-xs font-medium uppercase tracking-wider">
                OR
              </div>
            </div>
          </div>

          {/* Right: Upload Option OR Cropper */}
          <div className={cn(
            "flex flex-col gap-4 transition-all duration-300",
            isCropping ? "w-full md:w-2/3" : "w-full md:w-1/3"
          )}>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              {isCropping ? "Adjust Image" : "Upload Image"}
            </div>

            {isCropping ? (
              // Cropper View
              <div className="flex-1 flex flex-col gap-4 items-center justify-center">
                <div className="relative w-[260px] h-[260px] bg-slate-900 rounded-lg overflow-hidden shrink-0 shadow-inner border border-slate-800">
                  {imageSrc && (
                    <Cropper
                      image={imageSrc}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                      cropShape="round"
                      showGrid={false}
                      cropSize={{ width: 220, height: 220 }}
                    />
                  )}
                </div>
                <div className="flex items-center gap-4 w-full max-w-[260px]">
                  <span className="text-sm font-medium">Zoom</span>
                  <Slider
                    value={[zoom]}
                    min={1}
                    max={3}
                    step={0.1}
                    onValueChange={(value) => setZoom(value[0] ?? 1)}
                    className="flex-1"
                  />
                </div>
                <div className="flex gap-2 justify-end mt-2">
                  <Button variant="ghost" onClick={handleCancelCrop}>Cancel</Button>
                  <Button onClick={handleSaveCrop}>Save Icon</Button>
                </div>
              </div>
            ) : (
              // Upload Button View + Done Button
              <div className="flex-1 flex flex-col gap-4">
                <div
                  className="flex-1 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center gap-4 hover:border-indigo-500 hover:bg-slate-50 transition-colors cursor-pointer p-6 text-center"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="h-12 w-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Upload Logo</p>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG or GIF up to 5MB</p>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                  onClick={() => onOpenChange(false)}
                >
                  Done
                </Button>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}