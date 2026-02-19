import { z } from "zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const profissionalSchema = z.object({
	name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
	email: z.string().email("E-mail inválido"),
	phone: z.string().min(10, "Telefone inválido").optional().or(z.literal("")),
	specialty: z.string().optional().or(z.literal("")),
});

export type ProfissionalForm = z.infer<typeof profissionalSchema>;

interface ProfissionalFormPageProps {
	initialValues?: Partial<ProfissionalForm>;
	onSubmit: (data: ProfissionalForm) => void | Promise<void>;
	loading?: boolean;
	onCancel?: () => void;
}

const defaultValues: ProfissionalForm = {
	name: "",
	email: "",
	phone: "",
	specialty: "",
};

export function ProfissionalFormPage({ initialValues, onSubmit, loading, onCancel }: ProfissionalFormPageProps) {
	const form = useForm<ProfissionalForm>({
		resolver: zodResolver(profissionalSchema),
		defaultValues,
	});

	useEffect(() => {
		form.reset({ ...defaultValues, ...initialValues });
	}, [form, initialValues]);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nome</FormLabel>
							<FormControl>
								<Input placeholder="Nome completo" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>E-mail</FormLabel>
							<FormControl>
								<Input type="email" placeholder="email@exemplo.com" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="phone"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Telefone (opcional)</FormLabel>
							<FormControl>
								<Input placeholder="(11) 99999-9999" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="specialty"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Especialidade (opcional)</FormLabel>
							<FormControl>
								<Input placeholder="Ex: Cabeleireiro, Manicure..." {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
					{onCancel && (
						<Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
							Cancelar
						</Button>
					)}
					<Button type="submit" disabled={loading}>
						{loading ? "Salvando..." : "Salvar"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
