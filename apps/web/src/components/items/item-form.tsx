import { useForm } from "@tanstack/react-form";
import { Button } from "@/web/components/ui/button";
import { Input } from "@/web/components/ui/input";
import { Label } from "@/web/components/ui/label";
import { Textarea } from "@/web/components/ui/textarea";

interface ItemFormProps {
	initialTitle?: string;
	initialContent?: string;
	onSubmit: (title: string, content: string) => void;
	onCancel: () => void;
	isLoading?: boolean;
	submitLabel?: string;
}

export function ItemForm({
	initialTitle = "",
	initialContent = "",
	onSubmit,
	onCancel,
	isLoading,
	submitLabel = "Create",
}: ItemFormProps) {
	const form = useForm({
		defaultValues: {
			title: initialTitle,
			content: initialContent,
		},
		onSubmit: async ({ value }) => {
			onSubmit(value.title, value.content);
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="space-y-4"
		>
			<div className="space-y-2">
				<form.Field name="title">
					{(field) => (
						<>
							<Label htmlFor={field.name}>Title</Label>
							<Input
								id={field.name}
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="Enter title"
								required
							/>
						</>
					)}
				</form.Field>
			</div>

			<div className="space-y-2">
				<form.Field name="content">
					{(field) => (
						<>
							<Label htmlFor={field.name}>Content</Label>
							<Textarea
								id={field.name}
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="Enter content"
								rows={6}
								required
							/>
						</>
					)}
				</form.Field>
			</div>

			<div className="flex justify-end gap-2">
				<Button type="button" variant="outline" onClick={onCancel}>
					Cancel
				</Button>
				<Button type="submit" disabled={isLoading}>
					{isLoading ? "Saving..." : submitLabel}
				</Button>
			</div>
		</form>
	);
}
