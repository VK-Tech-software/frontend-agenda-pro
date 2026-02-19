import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";

const productSchema = z.object({
	name: z.string().min(1, "Nome inválido"),
	description: z.string().optional().or(z.literal("")),
	price: z.string().optional().or(z.literal("")),
	quantity: z.string().min(1, "Quantidade inválida").optional().or(z.literal("")),
});

export type ProductForm = z.infer<typeof productSchema>;

interface ProductFormPageProps {
	initialValues?: Partial<ProductForm>;
	onSubmit: (data: ProductForm) => void | Promise<void>;
	loading?: boolean;
	onCancel?: () => void;
}

export function ProductFormPage({ initialValues, onSubmit, loading, onCancel }: ProductFormPageProps) {
	const form = useForm<ProductForm>({
		resolver: zodResolver(productSchema),
		defaultValues: initialValues || { name: "", description: "", price: "", quantity: "" },
	});

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField name="name" control={form.control} render={({ field }) => (
					<FormItem>
						<FormLabel>Nome</FormLabel>
						<FormControl><Input {...field} /></FormControl>
						<FormMessage/>
					</FormItem>
				)} />

				<FormField name="description" control={form.control} render={({ field }) => (
					<FormItem>
						<FormLabel>Descrição</FormLabel>
						<FormControl><Input {...field} /></FormControl>
						<FormMessage/>
					</FormItem>
				)} />

				<FormField name="price" control={form.control} render={({ field }) => (
					<FormItem>
						<FormLabel>Preço</FormLabel>
						<FormControl><Input {...field} /></FormControl>
						<FormMessage/>
					</FormItem>
				)} />

				<FormField name="quantity" control={form.control} render={({ field }) => (
					<FormItem>
						<FormLabel>Quantidade</FormLabel>
						<FormControl><Input {...field} /></FormControl>
						<FormMessage/>
					</FormItem>
				)} />

				<div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
					{onCancel && <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>Cancelar</Button>}
					<Button type="submit" disabled={loading}>{loading ? <Loader2 className="animate-spin mr-2"/> : null}Salvar</Button>
				</div>
			</form>
		</Form>
	);
}
