"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { createWorkspace, validateSlug } from "@/server/actions/workspace";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
    Check,
    X,
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
    CircleDot,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WORKSPACE_WIZARD_ERRORS } from "@/lib/constants/workspace-wizard";

// Types
type WorkspaceType = "Company" | "Team" | "Project" | "Personal" | "Location" | "Other";
type Role = "admin" | "member" | "guest";

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
    iconName?: string;
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

interface CreateWorkspaceWizardProps {
    user?: {
        id: string;
        name?: string | null;
        email: string;
    };
    invitations?: any[];
    onSuccess?: () => void;
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

// Canvas helper for cropping - updated to return base64
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

    // Return as base64 for permanent storage
    const dataURL = canvas.toDataURL('image/jpeg', 0.8);
    return dataURL;
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
    { name: "indigo", bg: "bg-indigo-500", light: "bg-indigo-100", text: "text-indigo-600" },
    { name: "blue", bg: "bg-blue-500", light: "bg-blue-100", text: "text-blue-600" },
    { name: "green", bg: "bg-green-500", light: "bg-green-100", text: "text-green-600" },
    { name: "yellow", bg: "bg-yellow-500", light: "bg-yellow-100", text: "text-yellow-600" },
    { name: "red", bg: "bg-red-500", light: "bg-red-100", text: "text-red-600" },
    { name: "purple", bg: "bg-purple-500", light: "bg-purple-100", text: "text-purple-600" },
    { name: "pink", bg: "bg-pink-500", light: "bg-pink-100", text: "text-pink-600" },
    { name: "gray", bg: "bg-gray-500", light: "bg-gray-100", text: "text-gray-600" },
];

export default function CreateWorkspaceWizard({ user, invitations = [], onSuccess }: CreateWorkspaceWizardProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Workspace data state
    const [workspaceData, setWorkspaceData] = useState<WorkspaceData>({
        name: "",
        type: "Company",
        slug: "",
        icon: "",
        iconType: "lucide",
        iconName: "Building2",
        description: "",
        members: [],
        tools: [],
        iconColor: "indigo",
        backgroundColor: "indigo",
    });

    // Image upload state
    const [imageFile, setImageFile] = useState<string>("");
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
    const [showCropper, setShowCropper] = useState(false);

    // Email validation state
    const [slugValidationState, setSlugValidationState] = useState<{
        isValid: boolean | null;
        message: string;
    }>({
        isValid: null,
        message: "",
    });
    const [validatingSlug, setValidatingSlug] = useState(false);

    // Debounced slug validation
    useEffect(() => {
        if (!workspaceData.slug || workspaceData.slug.length < 3) {
            setSlugValidationState({ isValid: null, message: "" });
            return;
        }

        const timer = setTimeout(async () => {
            setValidatingSlug(true);
            try {
                const isValid = await validateSlug(workspaceData.slug);
                setSlugValidationState({
                    isValid,
                    message: isValid ? "This subdomain is available!" : WORKSPACE_WIZARD_ERRORS.SLUG_TAKEN,
                });
            } catch (err) {
                setSlugValidationState({
                    isValid: false,
                    message: WORKSPACE_WIZARD_ERRORS.NETWORK_ERROR,
                });
            } finally {
                setValidatingSlug(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [workspaceData.slug]);

    // Generate slug from name
    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    };

    // Handle name change and auto-generate slug
    const handleNameChange = (name: string) => {
        setWorkspaceData(prev => ({
            ...prev,
            name,
            slug: prev.slug || generateSlug(name),
        }));
    };

    // Handle file upload
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageFile(reader.result as string);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle crop complete
    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: CropArea) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    // Confirm crop
    const handleCropConfirm = async () => {
        if (!croppedAreaPixels) return;

        try {
            const croppedImage = await getCroppedImg(imageFile, croppedAreaPixels);
            setWorkspaceData(prev => ({
                ...prev,
                icon: croppedImage,
                iconType: "image",
            }));
            setShowCropper(false);
            setImageFile("");
        } catch (err) {
            console.error("Failed to crop image:", err);
            setError("Failed to process image. Please try again.");
        }
    };

    // Add team member
    const addTeamMember = () => {
        const newMember: TeamMember = {
            id: Date.now().toString(),
            name: "",
            email: "",
            role: "member",
        };
        setWorkspaceData(prev => ({
            ...prev,
            members: [...prev.members, newMember],
        }));
    };

    // Update team member
    const updateTeamMember = (id: string, field: keyof TeamMember, value: string) => {
        setWorkspaceData(prev => ({
            ...prev,
            members: prev.members.map(member =>
                member.id === id ? { ...member, [field]: value } : member
            ),
        }));
    };

    // Remove team member
    const removeTeamMember = (id: string) => {
        setWorkspaceData(prev => ({
            ...prev,
            members: prev.members.filter(member => member.id !== id),
        }));
    };

    // Toggle tool selection
    const toggleTool = (toolId: string) => {
        setWorkspaceData(prev => ({
            ...prev,
            tools: prev.tools.includes(toolId)
                ? prev.tools.filter(t => t !== toolId)
                : [...prev.tools, toolId],
        }));
    };

    // Validate step
    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                if (!workspaceData.name.trim()) {
                    setError(WORKSPACE_WIZARD_ERRORS.NAME_REQUIRED);
                    return false;
                }
                if (workspaceData.name.length < 2) {
                    setError(WORKSPACE_WIZARD_ERRORS.NAME_TOO_SHORT);
                    return false;
                }
                if (!workspaceData.slug) {
                    setError(WORKSPACE_WIZARD_ERRORS.SLUG_REQUIRED);
                    return false;
                }
                if (workspaceData.slug.length < 3) {
                    setError(WORKSPACE_WIZARD_ERRORS.SLUG_TOO_SHORT);
                    return false;
                }
                if (slugValidationState.isValid === false) {
                    setError(WORKSPACE_WIZARD_ERRORS.SLUG_TAKEN);
                    return false;
                }
                return true;

            case 2:
                return true; // Description is optional

            case 3:
                // Validate email addresses
                for (const member of workspaceData.members) {
                    if (member.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
                        setError(`Invalid email address: ${member.email}`);
                        return false;
                    }
                }
                return true;

            case 4:
                return true; // Tools are optional

            case 5:
                return true; // Review step just needs confirmation

            default:
                return false;
        }
    };

    // Next step
    const nextStep = () => {
        setError("");
        if (validateStep(currentStep)) {
            if (currentStep < 5) {
                setCurrentStep(currentStep + 1);
            } else {
                // Submit workspace
                handleSubmit();
            }
        }
    };

    // Previous step
    const prevStep = () => {
        setError("");
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Handle form submission
    const handleSubmit = async () => {
        setIsLoading(true);
        setError("");

        try {
            // Prepare metadata
            const metadata = {
                type: workspaceData.type,
                customType: workspaceData.customType,
                branding: {
                    iconType: workspaceData.iconType,
                    iconName: workspaceData.iconName,
                    iconColor: workspaceData.iconColor,
                    backgroundColor: workspaceData.backgroundColor,
                },
                enabledTools: workspaceData.tools,
            };

            // Create workspace
            await createWorkspace({
                name: workspaceData.name,
                slug: workspaceData.slug,
                description: workspaceData.description,
                // Note: You'll need to extend createWorkspace to accept metadata and logo
                // metadata,
                // logo: workspaceData.icon,
            });

            // TODO: Send invitations to team members
            // TODO: Handle file upload if workspace icon is selected

            onSuccess?.();
            router.push("/");
        } catch (err) {
            console.error("Failed to create workspace:", err);
            setError(WORKSPACE_WIZARD_ERRORS.CREATION_FAILED);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <TooltipProvider>
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Create Your Workspace
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Let's set up your workspace in just a few steps
                        </p>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex justify-between mb-8">
                        {steps.map((step) => (
                            <div
                                key={step.id}
                                className={cn(
                                    "flex items-center",
                                    step.id < currentStep && "text-green-600",
                                    step.id === currentStep && "text-blue-600",
                                    step.id > currentStep && "text-gray-400"
                                )}
                            >
                                <div
                                    className={cn(
                                        "flex items-center justify-center w-10 h-10 rounded-full border-2",
                                        step.id < currentStep && "bg-green-600 border-green-600 text-white",
                                        step.id === currentStep && "bg-blue-600 border-blue-600 text-white",
                                        step.id > currentStep && "border-gray-300 bg-white"
                                    )}
                                >
                                    {step.id < currentStep ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        <step.icon className="w-5 h-5" />
                                    )}
                                </div>
                                <span className="ml-2 text-sm font-medium hidden sm:block">
                                    {step.title}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Form Content */}
                    <Card>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {currentStep === 1 && (
                                    <Step1Identity
                                        workspaceData={workspaceData}
                                        onNameChange={handleNameChange}
                                        onSlugChange={(slug) => setWorkspaceData(prev => ({ ...prev, slug }))}
                                        onTypeChange={(type) => setWorkspaceData(prev => ({ ...prev, type }))}
                                        onCustomTypeChange={(customType) => setWorkspaceData(prev => ({ ...prev, customType }))}
                                        onIconSelect={(iconName) => setWorkspaceData(prev => ({ ...prev, iconName, iconType: "lucide" }))}
                                        onColorSelect={(color) => setWorkspaceData(prev => ({ ...prev, iconColor: color, backgroundColor: color }))}
                                        onFileUpload={handleFileUpload}
                                        slugValidationState={slugValidationState}
                                        validatingSlug={validatingSlug}
                                    />
                                )}

                                {currentStep === 2 && (
                                    <Step2Description
                                        description={workspaceData.description}
                                        onChange={(description) => setWorkspaceData(prev => ({ ...prev, description }))}
                                    />
                                )}

                                {currentStep === 3 && (
                                    <Step3Team
                                        members={workspaceData.members}
                                        onAddMember={addTeamMember}
                                        onUpdateMember={updateTeamMember}
                                        onRemoveMember={removeTeamMember}
                                    />
                                )}

                                {currentStep === 4 && (
                                    <Step4Tools
                                        selectedTools={workspaceData.tools}
                                        availableTools={availableTools}
                                        onToggleTool={toggleTool}
                                    />
                                )}

                                {currentStep === 5 && (
                                    <Step5Review
                                        workspaceData={workspaceData}
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation */}
                        <CardFooter className="flex justify-between pt-6">
                            <Button
                                variant="outline"
                                onClick={prevStep}
                                disabled={currentStep === 1 || isLoading}
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>

                            <Button
                                onClick={nextStep}
                                disabled={isLoading || (currentStep === 1 && slugValidationState.isValid === false)}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Creating...
                                    </>
                                ) : currentStep === 5 ? (
                                    <>
                                        Create Workspace
                                        <Check className="w-4 h-4 ml-2" />
                                    </>
                                ) : (
                                    <>
                                        Next
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Image Cropper Dialog */}
                    <Dialog open={showCropper} onOpenChange={setShowCropper}>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Crop Workspace Icon</DialogTitle>
                            </DialogHeader>
                            <div className="relative h-96">
                                <Cropper
                                    image={imageFile}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setShowCropper(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleCropConfirm}>
                                    Confirm Crop
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </TooltipProvider>
    );
}

// Step Components
function Step1Identity({
    workspaceData,
    onNameChange,
    onSlugChange,
    onTypeChange,
    onCustomTypeChange,
    onIconSelect,
    onColorSelect,
    onFileUpload,
    slugValidationState,
    validatingSlug,
}: {
    workspaceData: WorkspaceData;
    onNameChange: (name: string) => void;
    onSlugChange: (slug: string) => void;
    onTypeChange: (type: WorkspaceType) => void;
    onCustomTypeChange: (customType: string) => void;
    onIconSelect: (iconName: string) => void;
    onColorSelect: (color: string) => void;
    onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    slugValidationState: { isValid: boolean | null; message: string };
    validatingSlug: boolean;
}) {
    const [activeIconTab, setActiveIconTab] = useState("upload");
    const selectedColor = colors.find(c => c.name === workspaceData.iconColor) || colors[0];
    const SelectedIcon = iconList.find(i => i.name === workspaceData.iconName)?.icon || Building2;

    return (
        <CardContent className="space-y-6">
            {/* Workspace Name */}
            <div>
                <Label htmlFor="name">Workspace Name *</Label>
                <Input
                    id="name"
                    value={workspaceData.name}
                    onChange={(e) => onNameChange(e.target.value)}
                    placeholder="My Awesome Workspace"
                    className="mt-1"
                />
            </div>

            {/* Workspace Type */}
            <div>
                <Label htmlFor="type">Workspace Type</Label>
                <Select value={workspaceData.type} onValueChange={onTypeChange}>
                    <SelectTrigger className="mt-1">
                        <SelectValue />
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

                {workspaceData.type === "Other" && (
                    <Input
                        value={workspaceData.customType || ""}
                        onChange={(e) => onCustomTypeChange(e.target.value)}
                        placeholder="Specify workspace type"
                        className="mt-2"
                    />
                )}
            </div>

            {/* URL Slug */}
            <div>
                <Label htmlFor="slug">Workspace Subdomain *</Label>
                <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        https://
                    </span>
                    <Input
                        id="slug"
                        value={workspaceData.slug}
                        onChange={(e) => onSlugChange(e.target.value)}
                        placeholder="my-workspace"
                        className="rounded-none rounded-r-md"
                    />
                    <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500">
                        .ydtb.app
                    </span>
                </div>

                {/* Slug validation feedback */}
                <div className="mt-1 h-5">
                    {validatingSlug && (
                        <p className="text-sm text-gray-500">Checking availability...</p>
                    )}
                    {!validatingSlug && slugValidationState.message && (
                        <p className={cn(
                            "text-sm",
                            slugValidationState.isValid ? "text-green-600" : "text-red-600"
                        )}>
                            {slugValidationState.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Workspace Icon */}
            <div>
                <Label>Workspace Icon</Label>
                <Tabs value={activeIconTab} onValueChange={setActiveIconTab} className="mt-2">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload">Upload Image</TabsTrigger>
                        <TabsTrigger value="icon">Choose Icon</TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <Avatar className="w-20 h-20">
                                <AvatarImage src={workspaceData.icon} />
                                <AvatarFallback>
                                    <Building2 className="w-8 h-8" />
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={onFileUpload}
                                    className="hidden"
                                    id="icon-upload"
                                />
                                <label htmlFor="icon-upload">
                                    <Button variant="outline" asChild>
                                        <span>
                                            <Upload className="w-4 h-4 mr-2" />
                                            Upload Image
                                        </span>
                                    </Button>
                                </label>
                                <p className="text-sm text-gray-500 mt-1">
                                    Square images work best (min 256x256px)
                                </p>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="icon" className="space-y-4">
                        <div>
                            <Label className="text-sm font-medium">Select Color</Label>
                            <div className="flex space-x-2 mt-2">
                                {colors.map((color) => (
                                    <button
                                        key={color.name}
                                        onClick={() => onColorSelect(color.name)}
                                        className={cn(
                                            "w-8 h-8 rounded-full",
                                            color.bg,
                                            workspaceData.iconColor === color.name && "ring-2 ring-offset-2 ring-gray-400"
                                        )}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <Label className="text-sm font-medium">Select Icon</Label>
                            <ScrollArea className="h-48 mt-2 border rounded-md p-2">
                                <div className="grid grid-cols-6 gap-2">
                                    {iconList.map((icon) => {
                                        const Icon = icon.icon;
                                        return (
                                            <button
                                                key={icon.name}
                                                onClick={() => onIconSelect(icon.name)}
                                                className={cn(
                                                    "p-3 rounded-md flex items-center justify-center transition-colors",
                                                    workspaceData.iconName === icon.name
                                                        ? `${selectedColor.light} ${selectedColor.text}`
                                                        : "hover:bg-gray-100"
                                                )}
                                            >
                                                <Icon className="w-5 h-5" />
                                            </button>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Avatar className="w-20 h-20">
                                <AvatarFallback className={selectedColor.bg}>
                                    <SelectedIcon className="w-8 h-8 text-white" />
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm text-gray-500">Preview</p>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </CardContent>
    );
}

function Step2Description({
    description,
    onChange,
}: {
    description: string;
    onChange: (description: string) => void;
}) {
    return (
        <CardContent className="space-y-4">
            <div>
                <Label htmlFor="description">Workspace Description</Label>
                <p className="text-sm text-gray-500 mt-1">
                    Optional: Tell people what your workspace is about
                </p>
                <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="A collaborative workspace for our team to manage projects and share resources..."
                    className="mt-2 min-h-[150px]"
                />
                <p className="text-sm text-gray-500 mt-1 text-right">
                    {description.length} / 500 characters
                </p>
            </div>
        </CardContent>
    );
}

function Step3Team({
    members,
    onAddMember,
    onUpdateMember,
    onRemoveMember,
}: {
    members: TeamMember[];
    onAddMember: () => void;
    onUpdateMember: (id: string, field: keyof TeamMember, value: string) => void;
    onRemoveMember: (id: string) => void;
}) {
    return (
        <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Invite Team Members</h3>
                <Button onClick={onAddMember} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Member
                </Button>
            </div>

            {members.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No team members added yet</p>
                    <p className="text-sm">You can add members later if you prefer</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {members.map((member) => (
                        <div key={member.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                            <Avatar className="w-10 h-10">
                                <AvatarFallback>
                                    <User className="w-5 h-5" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                                <Input
                                    placeholder="Name (optional)"
                                    value={member.name}
                                    onChange={(e) => onUpdateMember(member.id, "name", e.target.value)}
                                />
                                <Input
                                    type="email"
                                    placeholder="Email address"
                                    value={member.email}
                                    onChange={(e) => onUpdateMember(member.id, "email", e.target.value)}
                                />
                                <Select
                                    value={member.role}
                                    onValueChange={(role: Role) => onUpdateMember(member.id, "role", role)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin - Full access</SelectItem>
                                        <SelectItem value="member">Member - Standard access</SelectItem>
                                        <SelectItem value="guest">Guest - Read-only</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onRemoveMember(member.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700">
                    <strong>Note:</strong> Team members will receive an email invitation to join your workspace.
                </p>
            </div>
        </CardContent>
    );
}

function Step4Tools({
    selectedTools,
    availableTools,
    onToggleTool,
}: {
    selectedTools: string[];
    availableTools: typeof availableTools;
    onToggleTool: (toolId: string) => void;
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [showAll, setShowAll] = useState(false);

    const filteredTools = availableTools.filter(tool =>
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const displayedTools = showAll ? filteredTools : filteredTools.slice(0, 9);

    return (
        <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Configure Workspace Tools</h3>
                <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                        {selectedTools.length} selected
                    </Badge>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            if (selectedTools.length === availableTools.filter(t => !t.disabled).length) {
                                // Deselect all
                                selectedTools.forEach(toolId => onToggleTool(toolId));
                            } else {
                                // Select all
                                availableTools.forEach(tool => {
                                    if (!tool.disabled && !selectedTools.includes(tool.id)) {
                                        onToggleTool(tool.id);
                                    }
                                });
                            }
                        }}
                    >
                        {selectedTools.length === availableTools.filter(t => !t.disabled).length ? "Deselect All" : "Select All"}
                    </Button>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                    placeholder="Search tools..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedTools.map((tool) => {
                    const Icon = tool.icon;
                    const isSelected = selectedTools.includes(tool.id);
                    const isDisabled = tool.disabled;

                    return (
                        <button
                            key={tool.id}
                            onClick={() => !isDisabled && onToggleTool(tool.id)}
                            disabled={isDisabled}
                            className={cn(
                                "p-4 border rounded-lg text-left transition-all",
                                isSelected && "border-blue-500 bg-blue-50 ring-2 ring-blue-200",
                                isDisabled && "opacity-50 cursor-not-allowed",
                                !isDisabled && !isSelected && "hover:border-gray-300 hover:shadow-sm"
                            )}
                        >
                            <div className="flex items-start space-x-3">
                                <div className={cn(
                                    "p-2 rounded-lg",
                                    isSelected ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                                )}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium">{tool.name}</h4>
                                    <p className="text-sm text-gray-500 mt-1">{tool.description}</p>
                                    {tool.disabled && (
                                        <p className="text-xs text-gray-400 mt-2">Coming soon</p>
                                    )}
                                </div>
                                {isSelected && (
                                    <Check className="w-5 h-5 text-blue-600" />
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {filteredTools.length > 9 && (
                <Button
                    variant="outline"
                    onClick={() => setShowAll(!showAll)}
                    className="w-full"
                >
                    {showAll ? "Show Less" : `Show ${filteredTools.length - 9} More Tools`}
                </Button>
            )}

            <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-sm text-amber-700">
                    <strong>Tip:</strong> You can always enable or disable tools later from workspace settings.
                </p>
            </div>
        </CardContent>
    );
}

function Step5Review({
    workspaceData,
}: {
    workspaceData: WorkspaceData;
}) {
    const selectedColor = colors.find(c => c.name === workspaceData.iconColor) || colors[0];
    const SelectedIcon = iconList.find(i => i.name === workspaceData.iconName)?.icon || Building2;
    const selectedTools = availableTools.filter(t => workspaceData.tools.includes(t.id));

    return (
        <CardContent className="space-y-6">
            <h3 className="text-lg font-medium">Review & Create</h3>

            {/* Workspace Summary */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                        {workspaceData.iconType === "image" ? (
                            <AvatarImage src={workspaceData.icon} />
                        ) : (
                            <AvatarFallback className={selectedColor.bg}>
                                <SelectedIcon className="w-8 h-8 text-white" />
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <div>
                        <h4 className="text-xl font-semibold">{workspaceData.name}</h4>
                        <p className="text-gray-500">
                            https://{workspaceData.slug}.ydtb.app
                        </p>
                        <Badge variant="outline" className="mt-1">
                            {workspaceData.type === "Other" ? workspaceData.customType : workspaceData.type}
                        </Badge>
                    </div>
                </div>

                {workspaceData.description && (
                    <div>
                        <h5 className="font-medium mb-1">Description</h5>
                        <p className="text-gray-600">{workspaceData.description}</p>
                    </div>
                )}

                {workspaceData.members.length > 0 && (
                    <div>
                        <h5 className="font-medium mb-2">Team Members ({workspaceData.members.length})</h5>
                        <div className="space-y-1">
                            {workspaceData.members.map((member) => (
                                <div key={member.id} className="flex items-center justify-between text-sm">
                                    <span>{member.email}</span>
                                    <Badge variant="outline" className="text-xs">
                                        {member.role}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {selectedTools.length > 0 && (
                    <div>
                        <h5 className="font-medium mb-2">Enabled Tools ({selectedTools.length})</h5>
                        <div className="flex flex-wrap gap-2">
                            {selectedTools.map((tool) => (
                                <Badge key={tool.id} variant="secondary">
                                    {tool.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-700">
                    <strong>Ready to create!</strong> Click "Create Workspace" to set up your new workspace.
                </p>
            </div>
        </CardContent>
    );
}