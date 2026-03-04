"use client"

import { useId, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function EmailInput() {
    const id = useId()
    const [isInvalid, setIsInvalid] = useState(false)
    const [email, setEmail] = useState("")

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return re.test(email)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value
        setEmail(newEmail)
        if (newEmail === "") {
            setIsInvalid(false)
        } else {
            setIsInvalid(!validateEmail(newEmail))
        }
    }

    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="block text-sm">
                Email
            </Label>
            <Input
                id={id}
                className="peer"
                placeholder="Email"
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                aria-invalid={isInvalid}
                required
            />
            {isInvalid && (
                <p
                    className="text-destructive mt-2 text-xs"
                    role="alert"
                    aria-live="polite"
                >
                    Email is invalid
                </p>
            )}
        </div>
    )
}
