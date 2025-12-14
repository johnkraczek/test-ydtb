
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Check,
    ChevronRight,
    ChevronLeft,
    Upload,
    Building2,
    Users,
    Briefcase,
    User,
    MapPin,
    MoreHorizontal,
    Mail,
    Trash2,
    Plus,
    LayoutDashboard,
    Calendar,
    Inbox,
    MessageSquare,
    Image as ImageIcon,
    Zap,
    FileText,
    BookOpen,
    ClipboardCheck,
    Ticket,
    BarChart2,
    ListTodo,
    FileHeart,
    Globe,
    Rocket,
    Code,
    Coffee,
    Heart,
    Star,
    Smile,
    Pencil,
    Search,
    Settings,
    Shield,
    Smartphone,
    Sun,
    Truck,
    Wifi,
    Target,
    Circle,
    CircleDot
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
type WorkspaceType = "Company" | "Team" | "Project" | "Personal" | "Location" | "Other";
type Role = "Admin" | "Member" | "Guest";

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: Role;
    message?: string;
}

interface WorkspaceData {
    name: string;
    type: WorkspaceType;
    customType?: string;
    slug: string;
    icon?: string;
    iconType: "image" | "lucide";
    description: string;
    members: TeamMember[];
    tools: string[];
    iconColor?: string;
    backgroundColor?: string;
}

interface CropArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

const steps = [
    { id: 1, title: "Identity", icon: Building2 },
    { id: 2, title: "Description", icon: FileText },
    { id: 3, title: "Team", icon: Users },
    { id: 4, title: "Tools", icon: Zap },
    { id: 5, title: "Review", icon: ClipboardCheck },
];

const availableTools = [
    { id: "contacts", name: "Contacts", description: "Manage clients and leads", icon: Users },
    { id: "calendar", name: "Booking Calendar", description: "Schedule appointments", icon: Calendar },
    { id: "inbox", name: "Unified Inbox", description: "All messages in one place", icon: Inbox },
    { id: "dashboards", name: "Dashboards", description: "Visual data overview", icon: LayoutDashboard },
    { id: "team-chat", name: "Team Communication", description: "Internal team chat", icon: MessageSquare },
    { id: "media", name: "Media Library", description: "Manage files and assets", icon: ImageIcon },
    { id: "automations", name: "Automations", description: "Workflow automation", icon: Zap },
    { id: "website", name: "Website Pages", description: "Landing pages and funnels", icon: Globe },
    { id: "sop", name: "SOP Library", description: "Standard Operating Procedures", icon: BookOpen },
    { id: "check-in", name: "Check-In Tool", description: "Client check-in system", icon: ClipboardCheck },
    { id: "coupons", name: "Coupon Tool", description: "Manage discounts", icon: Ticket },
    { id: "analytics", name: "Analytics & Reporting", description: "Deep insights", icon: BarChart2 },
    { id: "todos", name: "Todos", description: "Task management", icon: ListTodo },
    { id: "massage-notes", name: "Massage Notes", description: "Coming soon", icon: FileHeart, disabled: true },
];

// Canvas helper for cropping
const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });

async function getCroppedImg(imageSrc: string, pixelCrop: CropArea): Promise<string> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return "";
    }

    // set canvas size to match the bounding box
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // draw image
    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    // As a blob
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error('Canvas is empty'));
                return;
            }
            const fileUrl = window.URL.createObjectURL(blob);
            resolve(fileUrl);
        }, 'image/jpeg');
    });
}

// Icon Picker Icons
const iconList = [
    { name: "Building2", icon: Building2 },
    { name: "Briefcase", icon: Briefcase },
    { name: "Users", icon: Users },
    { name: "Globe", icon: Globe },
    { name: "Zap", icon: Zap },
    { name: "LayoutDashboard", icon: LayoutDashboard },
    { name: "Code", icon: Code },
    { name: "Coffee", icon: Coffee },
    { name: "Heart", icon: Heart },
    { name: "Star", icon: Star },
    { name: "Smile", icon: Smile },
    { name: "Rocket", icon: Rocket },
    { name: "Pencil", icon: Pencil },
    { name: "Search", icon: Search },
    { name: "Settings", icon: Settings },
    { name: "Shield", icon: Shield },
    { name: "Smartphone", icon: Smartphone },
    { name: "Sun", icon: Sun },
    { name: "Truck", icon: Truck },
    { name: "Wifi", icon: Wifi },
    { name: "Target", icon: Target },
];

const colors = [
    { name: "Slate", value: "slate" },
    { name: "Red", value: "red" },
    { name: "Orange", value: "orange" },
    { name: "Amber", value: "amber" },
    { name: "Green", value: "green" },
    { name: "Teal", value: "teal" },
    { name: "Blue", value: "blue" },
    { name: "Indigo", value: "indigo" },
    { name: "Violet", value: "violet" },
    { name: "Pink", value: "pink" },
];

const getColorClasses = (color: string) => {
    const map: Record<string, { bg: string, text: string, softBg: string }> = {
        slate: { bg: "bg-slate-600", text: "text-slate-600", softBg: "bg-slate-100" },
        red: { bg: "bg-red-600", text: "text-red-600", softBg: "bg-red-100" },
        orange: { bg: "bg-orange-600", text: "text-orange-600", softBg: "bg-orange-100" },
        amber: { bg: "bg-amber-600", text: "text-amber-600", softBg: "bg-amber-100" },
        yellow: { bg: "bg-yellow-600", text: "text-yellow-600", softBg: "bg-yellow-100" },
        lime: { bg: "bg-lime-600", text: "text-lime-600", softBg: "bg-lime-100" },
        green: { bg: "bg-green-600", text: "text-green-600", softBg: "bg-green-100" },
        emerald: { bg: "bg-emerald-600", text: "text-emerald-600", softBg: "bg-emerald-100" },
        teal: { bg: "bg-teal-600", text: "text-teal-600", softBg: "bg-teal-100" },
        cyan: { bg: "bg-cyan-600", text: "text-cyan-600", softBg: "bg-cyan-100" },
        sky: { bg: "bg-sky-600", text: "text-sky-600", softBg: "bg-sky-100" },
        blue: { bg: "bg-blue-600", text: "text-blue-600", softBg: "bg-blue-100" },
        indigo: { bg: "bg-indigo-600", text: "text-indigo-600", softBg: "bg-indigo-100" },
        violet: { bg: "bg-violet-600", text: "text-violet-600", softBg: "bg-violet-100" },
        purple: { bg: "bg-purple-600", text: "text-purple-600", softBg: "bg-purple-100" },
        fuchsia: { bg: "bg-fuchsia-600", text: "text-fuchsia-600", softBg: "bg-fuchsia-100" },
        pink: { bg: "bg-pink-600", text: "text-pink-600", softBg: "bg-pink-100" },
        rose: { bg: "bg-rose-600", text: "text-rose-600", softBg: "bg-rose-100" },
    };
    return map[color] || map.indigo;
};

export default function OnboardingWizard() {
    const [, setLocation] = useLocation();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<WorkspaceData>({
        name: "",
        type: "Company",
        slug: "",
        description: "",
        members: [],
        tools: [],
        iconType: "lucide",
        icon: "Building2",
        iconColor: "indigo",
        backgroundColor: "indigo",
    });
    const [slugError, setSlugError] = useState("");
    const [nameError, setNameError] = useState("");

    const handleNext = () => {
        if (currentStep === 1) {
            if (!formData.name) {
                setNameError("Please enter a workspace name");
                return;
            }
            if (slugError) return;
        }

        if (currentStep < 5) {
            setCurrentStep(currentStep + 1);
        } else {
            // Create workspace
            console.log("Creating workspace:", formData);
            setLocation("/");
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const updateFormData = (updates: Partial<WorkspaceData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const generateSlug = (name: string) => {
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        // Mock validation: "test" is taken
        if (slug === "test") {
            setSlugError("URL slug is already taken");
        } else {
            setSlugError("");
        }
        return slug;
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Top Navigation / Progress */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-semibold text-slate-900 hidden sm:inline-block">New Workspace</span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        {steps.map((step, index) => {
                            const isActive = step.id === currentStep;
                            const isCompleted = step.id < currentStep;

                            return (
                                <div key={step.id} className="flex items-center">
                                    <div className={cn(
                                        "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
                                        isActive ? "border-indigo-600 bg-indigo-50 text-indigo-600" :
                                            isCompleted ? "border-indigo-600 bg-indigo-600 text-white" :
                                                "border-slate-200 text-slate-400"
                                    )}>
                                        {isCompleted ? <Check className="h-4 w-4" /> : <span className="text-xs font-medium">{step.id}</span>}
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={cn(
                                            "w-4 sm:w-8 h-0.5 mx-1 sm:mx-2",
                                            isCompleted ? "bg-indigo-600" : "bg-slate-200"
                                        )} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 w-full max-w-3xl mx-auto p-4 sm:p-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {currentStep === 1 && (
                            <Step1Identity
                                data={formData}
                                updateData={updateFormData}
                                generateSlug={generateSlug}
                                slugError={slugError}
                                nameError={nameError}
                                setNameError={setNameError}
                            />
                        )}
                        {currentStep === 2 && (
                            <Step2Description
                                data={formData}
                                updateData={updateFormData}
                            />
                        )}
                        {currentStep === 3 && (
                            <Step3Team
                                data={formData}
                                updateData={updateFormData}
                            />
                        )}
                        {currentStep === 4 && (
                            <Step4Tools
                                data={formData}
                                updateData={updateFormData}
                            />
                        )}
                        {currentStep === 5 && (
                            <Step5Review
                                data={formData}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer Controls */}
            <div className="bg-white border-t border-slate-200 p-4 sticky bottom-0 z-50">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        disabled={currentStep === 1}
                        className={cn(currentStep === 1 && "invisible")}
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>

                    <Button
                        onClick={handleNext}
                        className="bg-indigo-600 hover:bg-indigo-700 min-w-[120px]"
                        disabled={!!slugError || (currentStep === 1 && !formData.name)}
                    >
                        {currentStep === 5 ? "Create Workspace" : "Continue"}
                        {currentStep !== 5 && <ChevronRight className="ml-2 h-4 w-4" />}
                    </Button>
                </div>
            </div>
        </div>
    );
}

// --- Step Components ---

function Step1Identity({
    data,
    updateData,
    generateSlug,
    slugError,
    nameError,
    setNameError
}: {
    data: WorkspaceData;
    updateData: (d: Partial<WorkspaceData>) => void;
    generateSlug: (name: string) => string;
    slugError: string;
    nameError: string;
    setNameError: (e: string) => void;
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [iconPickerOpen, setIconPickerOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isCropping, setIsCropping] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
    const [colorTarget, setColorTarget] = useState<"icon" | "background">("icon");
    const [iconSearch, setIconSearch] = useState("");

    const filteredIcons = iconList.filter(i =>
        i.name.toLowerCase().includes(iconSearch.toLowerCase())
    );

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        updateData({ name });
        setNameError("");
        if (!data.slug || data.slug === generateSlug(data.name)) {
            updateData({ slug: generateSlug(name) });
        }
    };

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
        updateData({ slug });
        // Re-run validation logic if needed
        if (slug === "test") {
            // Mock validation again for manual input
            // Ideally pass setError up
        }
    };

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

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSaveCrop = async () => {
        if (imageSrc && croppedAreaPixels) {
            try {
                const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
                updateData({ icon: croppedImage, iconType: "image" });
                setIsCropping(false);
                setIconPickerOpen(false);
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

    // Helper to render current icon
    const renderIcon = () => {
        if (data.iconType === "image" && data.icon) {
            return <AvatarImage key="image" src={data.icon} />;
        }

        // If lucide icon
        const IconComponent = iconList.find(i => i.name === data.icon)?.icon || Building2;
        const iconColorStyle = getColorClasses(data.iconColor || "indigo");
        const bgColorStyle = getColorClasses(data.backgroundColor || "indigo");

        return (
            <AvatarFallback key="icon" className={cn(bgColorStyle.softBg, iconColorStyle.text)}>
                <IconComponent className="h-10 w-10" />
            </AvatarFallback>
        );
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Workspace Identity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex flex-col items-center sm:flex-row gap-6">
                            <div
                                className="relative group cursor-pointer"
                                onClick={() => setIconPickerOpen(true)}
                            >
                                <Avatar className="h-24 w-24 border-2 border-dashed border-slate-300 group-hover:border-indigo-500 transition-colors">
                                    {renderIcon()}
                                </Avatar>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Pencil className="h-6 w-6 text-white" />
                                </div>
                            </div>

                            <div className="flex-1 space-y-4 w-full">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Workspace Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={handleNameChange}
                                        placeholder="e.g. Acme Corp"
                                        className={cn(nameError && "border-red-500 focus-visible:ring-red-500")}
                                    />
                                    {nameError && <p className="text-sm text-red-500">{nameError}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="type">Workspace Type</Label>
                                    <Select
                                        value={data.type}
                                        onValueChange={(v) => updateData({ type: v as WorkspaceType })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Company">Company</SelectItem>
                                            <SelectItem value="Team">Team</SelectItem>
                                            <SelectItem value="Project">Project</SelectItem>
                                            <SelectItem value="Personal">Personal</SelectItem>
                                            <SelectItem value="Location">Location</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {data.type === "Other" && (
                                        <Input
                                            placeholder="Specify type..."
                                            value={data.customType || ""}
                                            onChange={(e) => updateData({ customType: e.target.value })}
                                            className="mt-2"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="slug">Workspace URL</Label>
                            <div className="flex items-center">
                                <span className="bg-slate-100 border border-r-0 border-slate-200 rounded-l-md px-3 py-2 text-sm text-slate-500 h-10 flex items-center">
                                    https://
                                </span>
                                <Input
                                    id="slug"
                                    value={data.slug}
                                    onChange={handleSlugChange}
                                    className={cn("rounded-none h-10 border-x-0 focus-visible:ring-0 focus:border-indigo-500 z-10", slugError && "border-red-500 text-red-600")}
                                />
                                <span className="bg-slate-100 border border-l-0 border-slate-200 rounded-r-md px-3 py-2 text-sm text-slate-500 h-10 flex items-center">
                                    .ydtb.app
                                </span>
                            </div>
                            {slugError ? (
                                <p className="text-sm text-red-500">{slugError}</p>
                            ) : (
                                <p className="text-xs text-slate-500">
                                    Preview: https://{data.slug || "your-workspace"}.ydtb.app
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Icon Picker Dialog */}
            <Dialog
                open={iconPickerOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setIconPickerOpen(false);
                        // Reset cropping state if closed
                        setTimeout(() => {
                            setIsCropping(false);
                            setImageSrc(null);
                        }, 300);
                    } else {
                        setIconPickerOpen(true);
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
                                            {renderIcon()}
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
                                            {colors.map((c) => (
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
                                            onValueChange={(value) => setZoom(value[0])}
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
                                        onClick={() => setIconPickerOpen(false)}
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
        </>
    );
}

function Step2Description({
    data,
    updateData
}: {
    data: WorkspaceData;
    updateData: (d: Partial<WorkspaceData>) => void;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Workspace Description</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-2">
                    <Label htmlFor="description">About this workspace</Label>
                    <Textarea
                        id="description"
                        value={data.description}
                        onChange={(e) => updateData({ description: e.target.value })}
                        placeholder="Describe what this workspace is for..."
                        className="min-h-[200px]"
                    />
                    <div className="flex justify-end">
                        <span className="text-xs text-slate-400">
                            {data.description.length} characters
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function Step3Team({
    data,
    updateData
}: {
    data: WorkspaceData;
    updateData: (d: Partial<WorkspaceData>) => void;
}) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<Role>("Member");

    // Message Dialog State
    const [messageDialogOpen, setMessageDialogOpen] = useState(false);
    const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
    const [currentMessage, setCurrentMessage] = useState("");

    const addMember = () => {
        if (firstName && lastName && email) {
            const member: TeamMember = {
                id: Math.random().toString(36).substr(2, 9),
                name: `${firstName} ${lastName}`,
                email: email,
                role: role
            };
            updateData({ members: [...data.members, member] });
            setFirstName("");
            setLastName("");
            setEmail("");
            setRole("Member");
        }
    };

    const removeMember = (id: string) => {
        updateData({ members: data.members.filter(m => m.id !== id) });
    };

    const openMessageDialog = (member: TeamMember) => {
        setSelectedMemberId(member.id);
        setCurrentMessage(member.message || "");
        setMessageDialogOpen(true);
    };

    const saveMessage = () => {
        if (selectedMemberId) {
            updateData({
                members: data.members.map(m =>
                    m.id === selectedMemberId ? { ...m, message: currentMessage } : m
                )
            });
            setMessageDialogOpen(false);
            setSelectedMemberId(null);
            setCurrentMessage("");
        }
    };

    const roles = [
        {
            id: "Admin",
            label: "Admin",
            description: "Can invite, configure, and manage workspace."
        },
        {
            id: "Member",
            label: "Member",
            description: "Can view and edit projects and tasks."
        },
        {
            id: "Guest",
            label: "Guest",
            description: "Limited access to specific items."
        }
    ];

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle>Invite Team Members</CardTitle>
                <Button
                    onClick={addMember}
                    className="bg-black text-white hover:bg-slate-800"
                    disabled={!firstName || !lastName || !email}
                >
                    Add member
                </Button>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Add Member Form */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="firstName">First name</Label>
                            <Input
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="John"
                                className="bg-white"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="lastName">Last name</Label>
                            <Input
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Doe"
                                className="bg-white"
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="memberEmail">Email</Label>
                        <Input
                            id="memberEmail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@company.com"
                            className="bg-white"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Role</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {roles.map((r) => {
                                const isSelected = role === r.id;
                                return (
                                    <div
                                        key={r.id}
                                        onClick={() => setRole(r.id as Role)}
                                        className={cn(
                                            "flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all h-full",
                                            isSelected
                                                ? "border-black bg-white shadow-sm"
                                                : "border-slate-200 bg-white hover:border-slate-300"
                                        )}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            {isSelected ? (
                                                <CircleDot className="h-4 w-4 text-black shrink-0" />
                                            ) : (
                                                <Circle className="h-4 w-4 text-slate-300 shrink-0" />
                                            )}
                                            <span className="font-medium text-sm">{r.label}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed pl-6">
                                            {r.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Invited Members List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Invited Members</h4>
                        <Badge variant="outline" className="text-slate-500">{data.members.length}</Badge>
                    </div>

                    {data.members.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 bg-slate-50/50">
                            <div className="mx-auto h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 text-slate-400">
                                <Users className="h-6 w-6" />
                            </div>
                            <p className="font-medium">No members invited yet</p>
                            <p className="text-xs mt-1">Fill out the form above to add people</p>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {data.members.map(member => (
                                <div key={member.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-indigo-200 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-10 w-10 border border-slate-100">
                                            <AvatarFallback className="bg-indigo-50 text-indigo-600 font-medium">{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-semibold text-sm text-slate-900">{member.name}</div>
                                            <div className="text-xs text-slate-500">{member.email}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-slate-200 px-3 mr-2">{member.role}</Badge>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={cn(
                                                "h-8 w-8 transition-colors",
                                                member.message ? "text-indigo-600 bg-indigo-50" : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                                            )}
                                            onClick={() => openMessageDialog(member)}
                                        >
                                            <MessageSquare className="h-4 w-4" />
                                        </Button>

                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50" onClick={() => removeMember(member.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Message Dialog */}
                <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Personal Message</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Message for {data.members.find(m => m.id === selectedMemberId)?.name}</Label>
                                <Textarea
                                    value={currentMessage}
                                    onChange={(e) => setCurrentMessage(e.target.value)}
                                    placeholder="Hey, I'd love for you to join our new workspace..."
                                    className="min-h-[150px]"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>Cancel</Button>
                            <Button onClick={saveMessage}>Save Message</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}

function Step4Tools({
    data,
    updateData
}: {
    data: WorkspaceData;
    updateData: (d: Partial<WorkspaceData>) => void;
}) {
    const [searchQuery, setSearchQuery] = useState("");

    const toggleTool = (id: string) => {
        if (availableTools.find(t => t.id === id)?.disabled) return;

        const tools = data.tools.includes(id)
            ? data.tools.filter(t => t !== id)
            : [...data.tools, id];
        updateData({ tools });
    };

    const addAll = () => {
        // If searching, only add visible tools
        if (searchQuery) {
            const visibleIds = filteredTools.filter(t => !t.disabled).map(t => t.id);
            const newTools = [...new Set([...data.tools, ...visibleIds])];
            updateData({ tools: newTools });
        } else {
            updateData({ tools: availableTools.filter(t => !t.disabled).map(t => t.id) });
        }
    };

    const filteredTools = availableTools.filter(tool =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Card>
            <CardHeader className="space-y-4 pb-4">
                <div className="flex flex-row items-center justify-between">
                    <CardTitle>Configure Workspace Tools</CardTitle>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">{data.tools.length} enabled</span>
                        <Button variant="outline" size="sm" onClick={addAll}>
                            {searchQuery ? "Add Visible" : "Add All"}
                        </Button>
                    </div>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search tools..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-slate-50 border-slate-200"
                    />
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredTools.length > 0 ? (
                        filteredTools.map((tool) => {
                            const isSelected = data.tools.includes(tool.id);
                            const Icon = tool.icon;

                            return (
                                <div
                                    key={tool.id}
                                    onClick={() => toggleTool(tool.id)}
                                    className={cn(
                                        "relative flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer",
                                        tool.disabled ? "opacity-50 cursor-not-allowed bg-slate-50 border-slate-100" :
                                            isSelected
                                                ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                                                : "border-slate-200 hover:border-indigo-200 hover:bg-slate-50"
                                    )}
                                >
                                    <div className={cn(
                                        "h-10 w-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                                        isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                                    )}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={cn("font-medium", isSelected ? "text-indigo-900" : "text-slate-900")}>
                                            {tool.name}
                                        </h3>
                                        <p className="text-sm text-slate-500 mt-1">
                                            {tool.description}
                                        </p>
                                    </div>
                                    {isSelected && (
                                        <div className="absolute top-4 right-4">
                                            <Check className="h-5 w-5 text-indigo-600" />
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-1 md:col-span-2 text-center py-12 text-slate-500">
                            <div className="mx-auto h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 text-slate-400">
                                <Search className="h-6 w-6" />
                            </div>
                            <p>No tools found matching "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function Step5Review({
    data
}: {
    data: WorkspaceData;
}) {
    const renderIcon = () => {
        if (data.iconType === "image" && data.icon) {
            return <AvatarImage src={data.icon} />;
        }
        const IconComponent = iconList.find(i => i.name === data.icon)?.icon || Building2;
        return (
            <AvatarFallback className="bg-indigo-100 text-indigo-700">
                <IconComponent className="h-8 w-8" />
            </AvatarFallback>
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Review & Create</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Workspace Identity</h4>
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <Avatar className="h-16 w-16">
                                    {renderIcon()}
                                </Avatar>
                                <div>
                                    <div className="font-bold text-lg text-slate-900">{data.name}</div>
                                    <div className="text-sm text-slate-500">{data.type}</div>
                                    <div className="text-xs text-indigo-600 font-medium mt-1">
                                        https://{data.slug}.ydtb.app
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Description</h4>
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-600 whitespace-pre-wrap">
                                {data.description || "No description provided."}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Team Members ({data.members.length})</h4>
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
                                {data.members.length > 0 ? data.members.map(m => (
                                    <div key={m.id} className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-slate-700">{m.name}</span>
                                        <span className="text-slate-500 text-xs px-2 py-0.5 bg-slate-200 rounded-full">{m.role}</span>
                                    </div>
                                )) : (
                                    <span className="text-sm text-slate-400">No members invited</span>
                                )}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Enabled Tools ({data.tools.length})</h4>
                            <div className="flex flex-wrap gap-2">
                                {data.tools.map(toolId => {
                                    const tool = availableTools.find(t => t.id === toolId);
                                    if (!tool) return null;
                                    const Icon = tool.icon;
                                    return (
                                        <Badge key={toolId} variant="secondary" className="pl-1 pr-3 py-1 flex items-center gap-2">
                                            <div className="bg-white p-1 rounded-full">
                                                <Icon className="h-3 w-3 text-indigo-600" />
                                            </div>
                                            {tool.name}
                                        </Badge>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
