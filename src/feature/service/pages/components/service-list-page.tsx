import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export interface ServiceListItem {
	id: number;
	name: string;
	description?: string;
	price: number;
	durationMinutes: number;
}

interface ServiceListPageProps {
	services: ServiceListItem[];
	onEdit: (service: ServiceListItem) => void;
	onDelete: (id: number) => void;
	loading?: boolean;
	search?: string;
	onSearchChange?: (value: string) => void;
}

export function ServiceListPage({ services, onEdit, onDelete, loading, search, onSearchChange }: ServiceListPageProps) {
	const filtered = search
		? services.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
		: services;
	return (
		<div>
			<div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
				<input
					className="border rounded px-2 py-1 w-full sm:w-64"
					placeholder="Pesquisar por nome..."
					value={search || ""}
					onChange={e => onSearchChange?.(e.target.value)}
					disabled={loading}
				/>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Nome</TableHead>
						<TableHead>Descrição</TableHead>
						<TableHead>Preço</TableHead>
						<TableHead>Duração</TableHead>
						<TableHead>Ações</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filtered.length === 0 ? (
						<TableRow>
							<TableCell colSpan={5} className="text-center">Nenhum serviço encontrado</TableCell>
						</TableRow>
					) : (
						filtered.map((s) => (
							<TableRow key={s.id}>
								<TableCell>{s.name}</TableCell>
								<TableCell>{s.description}</TableCell>
								<TableCell>{Number.isFinite(s.price) ? s.price.toFixed(2) : (typeof s.price === 'string' && !Number.isNaN(parseFloat(s.price)) ? parseFloat(s.price).toFixed(2) : '-')}</TableCell>
								<TableCell>{s.durationMinutes ?? '-'}{typeof s.durationMinutes === 'number' ? ' min' : ''}</TableCell>
								<TableCell>
									<Button size="icon" variant="ghost" onClick={() => onEdit(s)} disabled={loading}>
										<Pencil size={16} />
									</Button>
									<Button size="icon" variant="ghost" onClick={() => onDelete(s.id)} disabled={loading}>
										<Trash2 size={16} />
									</Button>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}
