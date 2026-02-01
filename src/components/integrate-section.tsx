"use client"

import { motion } from "framer-motion"
import { CodeBlock } from "@/components/ui/code-block"
import {
    Braces,
    Terminal,
    Zap,
    Box,
    Cpu,
    Flame,
    Target,
    Rocket,
} from "lucide-react"

const techStacks = [
    { name: "Node.js", icon: Braces },
    { name: "Serverless", icon: Zap },
    { name: "Next.js", icon: Rocket },
    { name: "Python", icon: Terminal },
    { name: "Go", icon: Box },
    { name: "Rust", icon: Cpu },
    { name: "Ruby", icon: Flame },
    { name: "Astro", icon: Target },
]

const sdkTabs = [
    {
        label: "Node.js",
        language: "typescript",
        icon: <Braces className="size-full" />,
        code: `import { ObitoX } from 'obitox';

const client = new ObitoX('your_api_key');

await client.upload(file, {
  provider: 'r2',
  r2AccessKey: 'your_r2_access_key',
  r2SecretKey: 'your_r2_secret_key',
  r2AccountId: 'your_account_id',
  r2Bucket: 'my-bucket'
});
// Done! ✓`
    },
    {
        label: "Serverless",
        language: "typescript",
        icon: <Zap className="size-full" />,
        code: `// AWS Lambda / Cloudflare Workers
import { ObitoX } from 'obitox';

export default async (req) => {
  const client = new ObitoX(env.OBITOX_KEY);
  
  return await client.upload(req.file, {
    provider: 'r2',
    r2AccessKey: env.R2_ACCESS_KEY,
    r2SecretKey: env.R2_SECRET_KEY,
    r2AccountId: env.R2_ACCOUNT_ID,
    r2Bucket: 'uploads'
  });
};`
    },
    {
        label: "Next.js",
        language: "tsx",
        icon: <Rocket className="size-full" />,
        code: `// app/api/upload/route.ts
import { ObitoX } from 'obitox';

export async function POST(req: Request) {
  const client = new ObitoX(process.env.OBITOX_KEY);
  const formData = await req.formData();
  
  const result = await client.upload(formData.get('file'), {
    provider: 'supabase',
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
    supabaseBucket: 'uploads'
  });

  return Response.json(result);
}`
    },
    {
        label: "Python",
        language: "python",
        icon: <Terminal className="size-full" />,
        code: `from obitox import Client

client = Client(api_key="your_api_key")

result = client.upload(
    file=file,
    provider: 'r2',
    r2AccessKey: env.R2_ACCESS_KEY,
    r2SecretKey: env.R2_SECRET_KEY,
    r2AccountId: env.R2_ACCOUNT_ID,
    r2Bucket: 'uploads'
)

print(result.url)  # Done! ✓`
    },
    {
        label: "Go",
        language: "go",
        icon: <Box className="size-full" />,
        code: `package main

import "github.com/obitox/obitox-go"

func main() {
    client := obitox.NewClient("your_api_key")

    resp, _ := client.Upload(obitox.UploadParams{
        File:         file,
        Provider:     "r2",
        R2AccessKey:  "your_r2_access_key",
        R2SecretKey:  "your_r2_secret_key",
        R2AccountID:  "your_account_id",
        R2Bucket:     "my-bucket",
    })

    println(resp.URL)  // Done! ✓
}`
    },
    {
        label: "Rust",
        language: "rust",
        icon: <Cpu className="size-full" />,
        code: `use obitox::Client;

#[tokio::main]
async fn main() {
    let client = Client::new("your_api_key");
    
    let res = client.upload(UploadParams {
        file: file,
        provider: "supabase",
        supabase_url: "your_supabase_url",
        supabase_key: "your_supabase_key",
        supabase_bucket: "uploads",
    }).await?;
    
    println!("URL: {}", res.url);  // Done! ✓
}`
    },
    {
        label: "Ruby",
        language: "ruby",
        icon: <Flame className="size-full" />,
        code: `require 'obitox'

client = ObitoX::Client.new('your_api_key')

result = client.upload(
  file: file,
  provider: 'uploadcare',
  uploadcare_public_key: 'your_public_key',
  uploadcare_secret_key: 'your_secret_key'
)

puts result.url  # Done! ✓`
    },
    {
        label: "Astro",
        language: "tsx",
        icon: <Target className="size-full" />,
        code: `// src/pages/api/upload.ts
import { ObitoX } from 'obitox';

const client = new ObitoX(import.meta.env.OBITOX_KEY);

const formData = await Astro.request.formData();

const result = await client.upload(formData.get('file'), {
  provider: 'r2',
  r2AccessKey: import.meta.env.R2_ACCESS_KEY,
  r2SecretKey: import.meta.env.R2_SECRET_KEY,
  r2AccountId: import.meta.env.R2_ACCOUNT_ID,
  r2Bucket: 'uploads'
});

return Response.json(result);`}
]

export default function IntegrateSection() {
    return (
        <section id="solution" className="py-24 bg-transparent relative overflow-hidden scroll-mt-20">
            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
                    >
                        Integrate <span className="text-orange-500">this afternoon</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto"
                    >
                        One SDK, any language. Start uploading files in minutes
                        with less than 10 lines of code. No complexity, just results.
                    </motion.p>
                </div>

                {/* Tech Stack Icons */}
                <div className="flex flex-wrap justify-center gap-8 mb-16">
                    {techStacks.map((tech, idx) => (
                        <motion.div
                            key={tech.name}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex flex-col items-center gap-2 group cursor-default"
                        >
                            <div className="p-3 rounded-xl border bg-secondary/10 group-hover:bg-secondary/20 transition-colors border-border/50">
                                <tech.icon className="size-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                {tech.name}
                            </span>
                        </motion.div>
                    ))}
                </div>

                {/* Code Block Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="max-w-5xl mx-auto rounded-3xl border border-white/5 bg-zinc-950/40 p-2 md:p-4 shadow-2xl shadow-primary/5 backdrop-blur-sm"
                >
                    <CodeBlock
                        tabs={sdkTabs}
                        className="min-h-[350px] border-none bg-transparent"
                    />
                </motion.div>

                {/* Trust Pills */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-muted-foreground"
                >
                    <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-green-500" />
                        <span>7-10 lines of code</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-blue-500" />
                        <span>5 minute setup</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-orange-500" />
                        <span>Works everywhere</span>
                    </div>
                </motion.div>
            </div>

            {/* Background Orbs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10" />
        </section>
    )
}