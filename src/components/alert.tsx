import { TriangleAlert } from "lucide-react"
import { useFormState } from "react-dom"

export default function Alert({ message = "Some information is missing!" }: { message?: string }) {
  return (
    <div className="rounded-md border px-4 py-3">
      <p className="text-sm">
        <TriangleAlert
          className="me-3 -mt-0.5 inline-flex text-amber-500"
          size={16}
          aria-hidden="true"
        />
        {message}
      </p>
    </div>
  )
}