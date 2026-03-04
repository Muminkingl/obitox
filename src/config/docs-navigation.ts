// config/docs-navigation.ts
import {
    Home,
    Download,
    Rocket,
    Shield,
    Upload,
    Trash,
    List,
    Settings,
    AlertCircle,
    Zap,
    Image as ImageIcon,
    Lock,
    FileText,
    Cloud,
    Server,
    Database,
    Box,
    HardDrive,
    Boxes
} from "lucide-react";

export interface NavItem {
    title: string;
    href: string;
    icon?: any;
    badge?: string;
    children?: NavItem[];
}

export const docsNavigation: { title: string; items: NavItem[] }[] = [
    {
        title: "Getting Started",
        items: [
            {
                title: "Introduction",
                href: "/docs",
                icon: Home
            },
            {
                title: "Installation",
                href: "/docs/installation",
                icon: Download,
                badge: "Start here"
            },

        ],
    },

    {
        title: "Storage Providers",
        items: [
            {
                title: "Amazon S3",
                href: "/docs/providers/s3",
                icon: Database,
                children: [
                    { title: "Signed URLs", href: "/docs/providers/s3/signed-urls" },
                    { title: "Direct Upload", href: "/docs/providers/s3/direct-upload" },
                    { title: "List Objects", href: "/docs/providers/s3/list" },
                    { title: "Delete Objects", href: "/docs/providers/s3/delete" },
                    { title: "Configuration", href: "/docs/providers/s3/config" },
                ]
            },
            {
                title: "Cloudflare R2",
                href: "/docs/providers/r2",
                icon: Cloud,
                children: [
                    { title: "Signed URLs", href: "/docs/providers/r2/signed-urls" },
                    { title: "Direct Upload", href: "/docs/providers/r2/direct-upload" },
                    { title: "List Objects", href: "/docs/providers/r2/list" },
                    { title: "Delete Objects", href: "/docs/providers/r2/delete" },
                    { title: "Configuration", href: "/docs/providers/r2/config" },
                ]
            },
            {
                title: "Uploadcare",
                href: "/docs/providers/uploadcare",
                icon: Server,
                children: [
                    { title: "Signed URLs", href: "/docs/providers/uploadcare/signed-urls" },
                    { title: "Direct Upload", href: "/docs/providers/uploadcare/direct-upload" },
                    { title: "List Files", href: "/docs/providers/uploadcare/list" },
                    { title: "Delete Files", href: "/docs/providers/uploadcare/delete" },
                ]
            },
            {
                title: "Supabase",
                href: "/docs/providers/supabase",
                icon: Database,
                children: [
                    { title: "Signed URLs", href: "/docs/providers/supabase/signed-urls" },
                    { title: "Direct Upload", href: "/docs/providers/supabase/direct-upload" },
                    { title: "List Files", href: "/docs/providers/supabase/list" },
                    { title: "Delete Files", href: "/docs/providers/supabase/delete" },
                    { title: "RLS Policies", href: "/docs/providers/supabase/rls" },
                ]
            },


        ],
    },

];